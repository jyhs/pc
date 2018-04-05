import {mapActions} from 'vuex';

export default {
    data() {
        return {
            activeNames: ['info', 'cartDetails'],
            cart: {},
            user: {},
            group: {},
            detailList: [],
            detailsInCart: [],
            dialogVisible: false,
            currentRow: {},
            changedNumber: 0
        }
    },

    created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getCartById',
            'getUserById',
            'getGroupById',
            'getDetailsByBillId',
            'getDetailsByCartId',
            'deleteDetailById',
            'checkCartDetail',
            'updateCartDetail'
        ]),

        async initData() {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.cart = (await this.getCartById({id}))[0];
                this.user = (await this.getUserById({id: this.cart.user_id}))[0];
                this.group = (await this.getGroupById({id: this.cart.group_bill_id}))[0];
                this.detailList = await this.getDetailsByBillId({id: this.group.bill_id});
                this.initCartData();
            } catch (error) {
                console.error(error);
            }
            this.loading(false);
        },

        async initCartData() {
            const result = (await this.getDetailsByCartId({
                cartId: this.cart.id
            }))['res'];
            this.detailsInCart = this.detailList.filter(detail => {
                for (let item of result) {
                    if (detail.id === item.bill_detail_id) {
                        this.$set(detail, 'count', item['bill_detail_num']);
                        this.$set(detail, 'groupId', this.group.id);
                        return true;
                    }
                }
                return false;
            });
        },

        handleActions(row, actionType) {
            switch (actionType) {
                case 'delete':
                    this.dialogVisible = true;
                    this.currentRow = row;
                    break;
                default:
                    break;
            }
        },

        handleCancel() {
            this.dialogVisible = false;
            this.currentRow = {};
        },

        async handleConfirm() {
            this.dialogVisible = false;

            this.loading(true);
            let result = {};
            try {
                result = await this.deleteDetailById({
                    cart_id: this.cart.id,
                    bill_detail_id: this.currentRow.id
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.initCartData();
                this.$message({
                    type: 'success',
                    message: `删除${this.currentRow.name}成功`
                });
            }
        },

        handlePopoverShow(item) {
            this.currentRow = item;
            this.changedNumber = item.count;
        },

        handleNumberChange(changedNumber) {
            this.changedNumber = changedNumber;
        },

        async handleConfirmModify() {
            try {
                const checkResponse = await this.checkCartDetail({
                    cart_id: this.cart.id,
                    bill_detail_id: this.currentRow.id,
                    group_bill_id: this.group.id,
                    bill_detail_num: 1
                });
                if (checkResponse.status === 'ok') {
                    const result = await this.updateCartDetail({
                        cart_id: this.cart.id,
                        group_bill_id: this.group.id,
                        bill_detail_id: this.currentRow.id,
                        bill_detail_num: this.changedNumber
                    });

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: `更新${this.currentRow.name}成功`
                        });
                        this.initCartData();
                    }
                    this.triggerClick();
                }
            } catch (error) {
                console.error(error);
            }
        },

        triggerClick() {
            const tableComp = this.$refs.dataTable;
            if(document.all) {
                tableComp.click();
            } else {
                const e = document.createEvent("MouseEvents");
                e.initEvent("click", true, true);
                tableComp.dispatchEvent(e);
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'cartEdit') {
                this.initData();
            }
        }
    }
}