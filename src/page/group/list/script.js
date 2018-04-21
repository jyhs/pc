import {mapGetters, mapActions} from 'vuex';
import {Seawater_Provinces, GROUP_EXCEL_BASE_PATH} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, mapKey} from '@/utils/common';
import {formatDateTimeParam} from '@/utils/common';

export default {
    data () {
        return {
            searchForm: {
                name: ''
            },
            rules: {
                name: [
                    { required: true, message: '请填写查找的出货单名', trigger: 'blur' }
                ]
            },
            groupList: [],
            totalCount: 0,
            page: 1,
            size: 10,
            provinces: [],
            dialogVisible: false,
            reopenVisible: false,
            deleteVisible: false,
            currentRow: {},
            pickerOptions: {
                //只能选择大于等于今天的日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            endDate: '',
            accept: window.localStorage.getItem('SEAWATER_ACCEPT') || 'www'
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    async created () {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Provinces)) {
                this.provinces = getFromLocalStorage(Seawater_Provinces);
            } else {
                this.provinces = await this.getProvinces();
                saveToLocalStorage(Seawater_Provinces, this.provinces);
            }
        } catch (error) {
            console.error(error);
        }
        this.loading(false);

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getPayTypes',
            'getYesOrNo',
            'getProvinces',
            'getGroupList',
            'downloadGroupByIdAndUserId',
            'finishGroupByIdAndUserId',
            'reopenGroupByIdAndUserId',
            'deleteGroupById'
        ]),

        async initData (name) {
            name = name || this.searchForm.name || undefined;
            this.loading(true);
            let result = [];
            try {
                result = await this.getGroupList({
                    name,
                    page: this.page,
                    size: this.size,
                    gl_id: Number(window.localStorage.getItem('SEAWATER_USER_ID')),
                    province: this.$route.query.province
            });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.groupList = result.res || [];
            this.totalCount = result['count_res'] ? result['count_res'][0]['count'] : 0;
        },

        handleSearch () {
            if (!this.$refs['searchForm']) {
                return;
            }

            this.$refs['searchForm'].validate(async (valid) => {
                if (valid) {
                    this.initData(this.searchForm.name);
                }
            });
        },

        handleReset () {
            this.searchForm.name = '';
            this.initData();
        },

        handleSizeChange (size) {
            this.size = size;
            this.initData(this.searchForm.name);
        },

        handleCurrentChange (page) {
            this.page = page;
            this.initData(this.searchForm.name);
        },

        handleActions (row, actionType) {
            switch (actionType) {
                case 'groupEdit':
                case 'groupDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        }
                    });
                    break;
                case 'finish':
                    this.currentRow = row;
                    this.dialogVisible = true;
                    break;
                case 'reopen':
                    this.currentRow = row;
                    this.reopenVisible = true;
                    break;
                case 'delete':
                    this.currentRow = row;
                    this.deleteVisible = true;
                    break;
                default:
                    break;
            }
        },

        async downloadAboutGroup(group) {
            this.loading(true);
            let result = {};
            try {
                result = await this.downloadGroupByIdAndUserId({
                    id: group.id,
                    user_id: group.user_id,
                });

                if (result.status === 'ok') {
                    const elemIF = document.createElement("iframe");
                    elemIF.src = `${GROUP_EXCEL_BASE_PATH}${result.name}?${Math.random()}`;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                }
            } catch (error) {
                console.error(error);
            }

            this.loading(false);
        },

        handleCancel () {
            this.currentRow = {};
            this.dialogVisible = false;
        },

        handleReopenCancel() {
            this.currentRow = {};
            this.reopenVisible = false;
        },

        handleDeleteCancel() {
            this.currentRow = {};
            this.deleteVisible = false;
        },

        async handleConfirm () {
            this.dialogVisible = false;

            this.loading(true);
            let result = {};
            try {
                result = await this.finishGroupByIdAndUserId({
                    id: this.currentRow.id,
                    user_id: this.currentUser.id
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `结束团单${this.currentRow.name}成功`
                });
                this.initData();
            }
        },

        async handleConfirmReopen() {
            if (!this.endDate) {
                this.$notify({
                    type: 'warning',
                    message: `请选择截止时间`
                });
                return;
            }

            this.reopenVisible = false;
            this.loading(true);
            let result = {};
            try {
                result = await this.reopenGroupByIdAndUserId({
                    id: this.currentRow.id,
                    user_id: this.currentUser.id,
                    end_date: formatDateTimeParam(this.endDate)
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `重新开始团单${this.currentRow.name}成功`,
                    duration: 5000
                });
                this.endDate = '';
                this.initData();
            }
        },

        async handleConfirmDelete() {
            this.deleteVisible = false;
            this.loading(true);
            let result = {};
            try {
                result = await this.deleteGroupById({
                    id: this.currentRow.id,
                    user_id: this.currentUser.id,
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `删除团单${this.currentRow.name}成功`,
                    duration: 5000
                });
                this.endDate = '';
                this.initData();
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'groupList') {
                this.initData();
            }
        }
    }
}
