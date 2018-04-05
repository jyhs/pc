import {mapGetters, mapActions} from 'vuex';

export default {
    data () {
        return {
            searchForm: {
                name: ''
            },
            billList: [],
            totalCount: 0,
            currentRow: {},
            page: 1,
            size: 10,
            dialogVisible: false,
            usersLssAndPfs: []
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    async created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserList',
            'getBillList',
            'deleteBillByIdAndUserId'
        ]),

        async initData(name) {
            this.loading(true);
            let result = [];
            try {
                result = await this.getBillList({name, page: this.page, size: this.size});
                this.usersLssAndPfs = (await this.getUserList({
                    type1: 'lss',
                    type2: 'pfs'
                }))['users'];
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.billList = result['bills'] || [];
            this.totalCount = result['count'] ? result['count'][0]['count'] : 0;
        },

        handleSearch() {
            this.$refs['searchForm'].validate((valid) => {
                if (valid) {
                    this.initData(this.searchForm.name);
                }
            });
        },

        handleReset() {
            this.searchForm.name = '';
            this.initData();
        },

        handleSizeChange(size) {
            this.size = size;
            this.initData(this.searchForm.name);
        },

        handleCurrentChange(page) {
            this.page = page;
            this.initData(this.searchForm.name);
        },

        handleActions(row, actionType) {
            switch (actionType) {
                case 'detailList':
                case 'billEdit':
                case 'billDetail':
                case 'groupAdd':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        }
                    });
                    break;
                case 'delete':
                    this.currentRow = row;
                    this.dialogVisible = true;
                    break;
                default:
                    break;
            }
        },

        handleCancel() {
            this.currentRow = {};
            this.dialogVisible = false;
        },

        async handleConfirm() {
            this.dialogVisible = false;

            this.loading(true);
            let result = {};
            try {
                result = await this.deleteBillByIdAndUserId({
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
                    message: `删除出货单${this.currentRow.name}成功`
                });
                this.initData();
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'billList') {
                this.initData();
            }
        }
    }
}