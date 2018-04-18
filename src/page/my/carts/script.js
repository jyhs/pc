import {mapGetters, mapActions} from 'vuex';
import {compile} from '@/utils/common';

export default {
    data() {
        return {
            cartList: [],
            currentRow: {},
            totalCount: 0,
            page: 1,
            size: 10,
            dialogVisible: false,
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    created() {
        if (this.currentUser.id) {
            this.initData();
        }
    },

    methods: {
        ...mapActions([
            'loading',
            'getCartsByUserId',
            'deleteCartById'
        ]),

        async initData() {
            this.loading(true);
            let result = [];
            try {
                result = await this.getCartsByUserId({
                    page: this.page,
                    size: this.size,
                    userId: this.currentUser.id
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.cartList = result.res || [];
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

        handleActions (cart, actionType) {
            switch (actionType) {
                case 'buyPage':
                    this.$router.push({
                        name: actionType,
                        params: {
                            groupId: compile(`${cart['group_id']}`)
                        }
                    });
                    break;
                case 'cartDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: cart.id
                        },
                        query: {
                            name: this.currentUser.name
                        }
                    });
                    break;
                case 'cartEdit':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: cart.id
                        }
                    });
                    break;
                case 'delete':
                    this.currentRow = cart;
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

            let result = {};
            this.loading(true);
            try {
                result = await this.deleteCartById({
                    id: this.currentRow.id
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `'删除购物车成功`
                });
                this.initData();
            }
        },

        mapDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
            const day =  date.getDate() + 1 < 10 ? `0${date.getDate() + 1}` : (date.getDate() + 1);
            return `${year}-${month}-${day} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'myCarts') {
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