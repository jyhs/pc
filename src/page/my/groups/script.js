import {mapGetters, mapActions} from 'vuex';
import {BASE_PATH, BASE_PRIVATE_PATH, GROUP_EXCEL_BASE_PATH, API_BASE_PATH} from '@/constants/index';
import {formatDateParam, formatDateTimeParam, isEmpty, compile} from '@/utils/common';

export default {
    data() {
        return {
            groupList: [],
            currentRow: {},
            totalCount: 0,
            page: 1,
            size: 10,
            dialogVisible: false,
            reopenVisible: false,
            qrCodeVisible: false,
            pickerOptions: {
                //只能选择大于等于今天的日期
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            endDate: '',
            qrCodeUrl: '',
            privateUrl: '',
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    created() {
        if (this.currentUser && this.currentUser.id) {
            this.initData();
        }
    },

    methods: {
        ...mapActions([
            'loading',
            'getGroupList',
            'finishGroupByIdAndUserId',
            'downloadGroupByIdAndUserId',
            'reopenGroupByIdAndUserId',
            'getQrCodeByGroupId'
        ]),

        async initData() {
            this.loading(true);
            let result = [];
            try {
                result = await this.getGroupList({
                    page: this.page,
                    size: this.size,
                    userId: this.currentUser.id
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.groupList = result.res || [];
            this.totalCount = result['count_res'] ? result['count_res'][0]['count'] : 1;
        },

        handleSizeChange(size) {
            this.size = size;
            this.initData();
        },

        handleCurrentChange(page) {
            this.page = page;
            this.initData();
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
                case 'cartGroup':
                    this.$router.push({
                        name: actionType,
                        params: {
                            groupId: row.id,
                            userId: row.user_id
                        },
                        query: {
                            groupName: row.name
                        }
                    });
                    break;
                case 'delete':
                    this.currentRow = row;
                    this.dialogVisible = true;
                    break;
                case 'reopen':
                    this.currentRow = row;
                    this.reopenVisible = true;
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

        getQrCodeInGroup(group) {
            this.qrCodeVisible = true;
            this.qrCodeUrl = `${API_BASE_PATH}/api/tools/qrCode?id=${group.id}&random_id=${Math.random()}`;
            this.privateUrl = `${BASE_PRIVATE_PATH}/#/buy/${compile(`${group.id}`)}/page`;
        },

        handleCancel() {
            this.currentRow = {};
            this.dialogVisible = false;
        },

        handleReopenCancel() {
            this.currentRow = {};
            this.reopenVisible = false;
        },

        handleQrCodeCancel() {
            this.qrCodeVisible = false;
        },

        async handleConfirm() {
            this.dialogVisible = false;

            let result = {};
            this.loading(true);
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
                    message: `重新开始团购${this.currentRow.name}成功`,
                    duration: 5000
                });
                this.endDate = '';
                this.initData();
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'myGroups') {
                this.initData();
            }
        },
        'currentUser': {
            handler: function () {
                this.initData();
            },
            deep: true
        }
    }
}
