import {mapGetters, mapActions} from 'vuex';
import {Seawater_Provinces, Seawater_User_Types} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, mapKey} from '@/utils/common';
import {Message} from 'element-ui';

export default {
    data() {
        return {
            userName: '',
            cartList: [],
            currentRow: {},
            totalCount: 0,
            page: 1,
            size: 10,
            dialogVisible: false
        }
    },

    async created() {
        this.initData();
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    methods: {
        ...mapActions([
            'loading',
            'getUserById',
            'getCartsByUserId',
            'deleteCartById'
        ]),

        async initData() {
            const {id} = this.$route.params;
            const {userName} = this.$route.query;

            this.userName = userName;
            this.loading(true);
            let result = [];
            try {
                result = await this.getCartsByUserId({
                    page: this.page,
                    size: this.size,
                    userId: id
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.cartList = result.res || [];
            this.totalCount = result['count_res'] ? result['count_res'][0]['count'] : 0;
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
                case 'cartEdit':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        }
                    });
                    break;
                case 'cartDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        },
                        query: {
                            name: this.currentUser.name
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
                    message: `'删除订单成功`
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
            if (to.name ==='cartList') {
                this.initData();
            }
        }
    }
}