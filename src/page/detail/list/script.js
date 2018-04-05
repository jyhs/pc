import {mapGetters, mapActions} from 'vuex';

export default {
    data () {
        return {
            searchForm: {
                billDetailName: ''
            },
            rules: {
                billDetailName: [
                    { required: true, message: '请填写查找的明细名', trigger: 'blur' }
                ]
            },
            billDetails: [],
            totalCount: 0,
            currentRow: {},
            page: 1,
            size: 10,
            dialogVisible: false,
        };
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getDetailsByBillId',
            'deleteDetailByIdAndUserIdAndBillId'
        ]),

        async initData(name) {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.billDetails = await this.getDetailsByBillId({
                    id,
                    name
                });
                this.totalCount = this.billDetails.length;
            } catch (error) {
                console.error(error);
            }
            this.loading(false);
        },

        handleSearch () {
            this.$refs['searchForm'].validate(async (valid) => {
                if (valid) {
                    this.initData(this.searchForm.billDetailName);
                }
            });
        },

        handleReset () {
            this.searchForm.billDetailName = '';
            this.initData();
        },

        handleAdd () {
            const {id} = this.$route.params;

            this.$router.push({
                name: 'detailAdd',
                params: {
                    id
                }
            });
        },

        handleBack () {
            this.$router.push({name: 'billList'});
        },

        handleSizeChange (size) {
            this.size = size;
            this.initData(this.searchForm.billDetailName);
        },

        handleCurrentChange (page) {
            this.page = page;
            this.initData(this.searchForm.billDetailName);
        },

        handleUpdate (row) {
            this.$router.push({
                name: 'detailEdit',
                params: {
                    billId: this.$route.params.id,
                    detailId: row.id
                }
            });
        },

        handleDelete (row) {
            this.currentRow = row;
            this.dialogVisible = true;
        },

        handleCancel () {
            this.currentRow = {};
            this.dialogVisible = false;
        },

        async handleConfirm () {
            this.dialogVisible = false;

            this.loading(true);
            let result = {};
            try {
                result = await this.deleteDetailByIdAndUserIdAndBillId({
                    bill_detail_id: this.currentRow.id,
                    bill_id: this.$route.params.id,
                    user_id: this.currentUser.id
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `删除明细${this.currentRow.name}成功`
                });
                this.initData();
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'detailList') {
                this.initData();
            }
        }
    }
}