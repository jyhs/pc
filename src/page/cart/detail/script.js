import {mapActions} from 'vuex';
import {SMALL_IMAGE_BASE_PATH} from '@/constants/index';

export default {
    data () {
        return {
            cart: {},
            ownerName: this.$route.query.name,
            group: {},
            detailList: [],
            detailsInCart: [],
            imagePath: '',
            activeNames: ['info', 'groupInfo', 'cartDetails'],
            preDetail: {},
        }
    },

    created () {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getCartById',
            'getGroupById',
            'getDetailsByBillId',
            'getDetailsByCartId',
            'getEncyImageById'
        ]),

        async initData() {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.cart = (await this.getCartById({id}))[0] || {};
                this.group = (await this.getGroupById({id: this.cart.group_bill_id}))[0];
                this.detailList = await this.getDetailsByBillId({id: this.group.bill_id});
                this.updateDetailsInCart();
            } catch (error) {
                console.error(error);
            }
            this.loading(false);
        },

        async updateDetailsInCart() {
            try {
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
            } catch (error) {
                console.error(error);
            }
        },

        async handleDetailImageShow (detail) {
            if (!detail['material_id']) {
                this.preDetail = detail;
                this.imagePath = require('../../../assets/svg/default_detail.svg');
                return;
            }
            if (detail.id === this.preDetail.id) {
                return;
            }

            this.preDetail = detail;
            this.imagePath = '';
            let result = {};
            try {
                result = await this.getEncyImageById({id: detail['material_id']});
            } catch (error) {
                console.error(error);
            }

            if (result.status === 'ok') {
                if (result.image) {
                    this.imagePath = `${SMALL_IMAGE_BASE_PATH}${result.image}`;
                } else {
                    this.imagePath = require('../../../assets/svg/default_detail.svg');
                }
            }
        },
    },

    watch: {
        '$route'(to) {
            if (to.name === 'cartDetail') {
                this.initData();
            }
        }
    }
}