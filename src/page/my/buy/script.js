import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import {isEmpty, uncompile} from '@/utils/common';
import {Seawater_Now_Province, SMALL_IMAGE_BASE_PATH, TAOBAO_QR_BASE_PATH,
    WECHAT_QR_BASE_PATH
} from '@/constants/index';

const PayBasePath = {
    zfb: TAOBAO_QR_BASE_PATH,
    wx: WECHAT_QR_BASE_PATH
};

export default {
    data() {
        const telephoneValidator = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if (!/^1[23456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        };
        return {
            group: {},
            groupCount: 0,
            detailList: [],
            cart: {},
            cartCount: 0,
            detailsInCart: [],
            cartDetailIds: [],
            cartForm: {
                telephone: '',
                remark: ''
            },
            rules: {
                telephone: [
                    {required: true, message: '请输入手机号'},
                    {validator: telephoneValidator, trigger: 'blur'}
                ],
            },
            dialogVisible: false,
            currentRow: {},
            preDetail: {},
            imagePath: '',
            payType: '',
            payQrCodePath: '',
            qqInfo: ''
        }
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
            'getGroupById',
            'getCountById',
            'getDetailsByBillId',
            'getCartUnderUserByGroupId',
            'getDetailsByCartId',
            'getCartById',
            'addCart',
            'updateCart',
            'addDetailToCart',
            'updateCartDetail',
            'deleteDetailById',
            'getEncyImageById',
            'getPayQrCode',
            'updateUserPhone',
            'updateCurrentUser',
            'checkCartDetail',
            'getCityByCode'
        ]),

        async initData() {
            let {groupId} = this.$route.params;
            groupId = Number(uncompile(groupId));
            const userId = parseInt(window.localStorage.getItem('SEAWATER_USER_ID'));

            this.loading(true);
            try {
                this.group = (await this.getGroupById({id: groupId}))[0];
                this.groupCount = (await this.getCountById({id: groupId}))[0].sum;
                this.detailList = await this.getDetailsByBillId({id: this.group.bill_id});
                this.cart = (await this.getCartUnderUserByGroupId({
                    groupId,
                    userId,
                }))[0];
                const result = await this.getPayQrCode({id: this.group.user_id});
                this.qqInfo = (await this.getCityByCode({code: this.group.city}))['qq'];
                if (result.status === 'ok' && result.type) {
                    this.payType = result.type;
                    this.payQrCodePath = `${PayBasePath[result.type]}${result.imgPath}?${Math.random()}`;
                } else {
                    this.payType = '';
                    this.payQrCodePath = '';
                }
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (this.alreadyHasCart()) {
                this.updateDetailsInCart();
                if (this.cart) {
                    if (isEmpty(this.cart.phone)) {
                        this.cartForm.telephone = this.currentUser.phone;
                    } else {
                        this.cartForm.telephone = this.cart.phone;
                    }
                    if (isEmpty(this.cart.description)) {
                        this.cartForm.remark = '';
                    } else {
                        this.cartForm.remark = this.cart.description;
                    }
                } else {
                    this.cartForm.telephone = this.currentUser.phone;
                    this.cartForm.remark = '';
                }
            } else {
                if (this.groupIsValid()) {
                    this.addNewCart();
                    this.cartForm.telephone = this.currentUser.phone;
                    this.cartForm.remark = '';
                } else {
                    this.detailsInCart = [];
                }
            }
        },

        async addNewCart() {
            try {
                const result = await this.addCart({
                    group_bill_id: this.group.id,
                    user_id: this.currentUser.id,
                    status: 0
                });
                if (result.status === 'ok') {
                    this.cart = (await this.getCartUnderUserByGroupId({
                        groupId: this.group.id,
                        userId: this.currentUser.id
                    }))[0];
                }
            } catch (error) {
                console.error(error);
            }
        },

        async handleAddToCart(detail) {
            let checkResponse = {};
            try {
                checkResponse = await this.checkCartDetail({
                    cart_id: this.cart.id,
                    bill_detail_id: detail.id,
                    group_bill_id: this.group.id,
                    bill_detail_num: 1
                });
                if (checkResponse.status === 'ok') {
                    const copyDetail = {...detail};
                    const searchedDetail = this.detailsInCart.filter(detail => {
                        return detail.id === copyDetail.id && detail.groupId === this.group.id;
                    })[0];
                    if (searchedDetail) {
                        searchedDetail.count++;
                    } else {
                        copyDetail.groupId = this.group.id;
                        copyDetail.count = 1;
                        copyDetail.checked = true;
                        this.detailsInCart.push(copyDetail);

                        const userId = parseInt(window.localStorage.getItem('SEAWATER_USER_ID'));
                        const detailInStore = JSON.parse(window.localStorage.getItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`));
                        if (detailInStore) {
                            window.localStorage.setItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`, JSON.stringify([
                                ...detailInStore, copyDetail
                            ]));
                        } else {
                            window.localStorage.setItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`, JSON.stringify([
                                copyDetail
                            ]));
                        }
                    }
                    this.getCartDetailsIds();
                    this.calculateCartCount();
                    this.updateDetailsImg();
                } else {
                    this.$message({
                        type: 'warning',
                        message: checkResponse.status
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },

        calculateCartCount(detail) {
            this.$nextTick(async () => {
                // if (detail) {
                //     const left = Number(detail.left_numbers);
                //     if (left < detail.count) {
                //         this.$message({
                //             type: 'warning',
                //             message: `剩余数量不足了，请添加其他宝贝~~~`
                //         });
                //         return;
                //     }
                // }

                let checkResponse = {status: 'ok'};
                try {
                    if (detail) {
                        checkResponse = await this.checkCartDetail({
                            cart_id: this.cart.id,
                            bill_detail_id: detail.id,
                            group_bill_id: this.group.id,
                            bill_detail_num: detail.count
                        });
                    }

                    if (checkResponse.status === 'ok') {
                        let cartCount = 0;
                        for (let detail of this.detailsInCart) {
                            cartCount += detail.price * detail.count;
                        }
                        this.cartCount = cartCount;

                        if (this.detailsInCart && this.detailsInCart.length) {
                            const userId = parseInt(window.localStorage.getItem('SEAWATER_USER_ID'));
                            window.localStorage.setItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`, JSON.stringify(this.detailsInCart));
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: checkResponse.status
                        });
                        detail.count = detail.count - 1;
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        },

        async updateDetailsImg() {
            this.detailsInCart.map(async detail => {
                const imgPath = await this.getDetailImage(detail);
                this.$set(detail, 'imgPath', imgPath);
            });
        },

        handleMoveFromCart(detail) {
            this.dialogVisible = true;
            this.currentRow = detail;
        },

        async handleConfirmDelete() {
            const userId = parseInt(window.localStorage.getItem('SEAWATER_USER_ID'));

            this.dialogVisible = false;
            let deleteIndex = -1;
            for (let i = 0; i < this.detailsInCart.length; i++) {
                if (this.detailsInCart[i].id === this.currentRow.id) {
                    deleteIndex = i;
                    break;
                }
            }
            if (deleteIndex !== -1) {
                let result = {};
                try {
                    result = await this.deleteDetailById({
                        cart_id: this.cart.id,
                        bill_detail_id: this.currentRow.id
                    });
                } catch (error) {
                    console.error(error);
                }

                if (result.status === 'ok') {
                    this.detailsInCart.splice(deleteIndex, 1);
                    window.localStorage.setItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`, JSON.stringify(this.detailsInCart));
                    let {groupId} = this.$route.params;
                    groupId = Number(uncompile(groupId));
                    this.groupCount = (await this.getCountById({id: groupId}))[0].sum;
                    this.detailList = await this.getDetailsByBillId({id: this.group.bill_id});
                    this.$message({
                        type: 'success',
                        message: `删除${this.currentRow.name}成功`
                    });
                }
            }
        },

        getCartDetailsIds() {
            this.cartDetailIds = this.detailsInCart.map(detail => {
                return detail.id;
            });
            return this.cartDetailIds;
        },

        async getDetailImage(detail) {
            if (!detail['material_id']) {
                return require('../../../assets/svg/default_detail.svg');
            }

            this.loading(true);
            let result = {};
            try {
                result = await this.getEncyImageById({id: detail['material_id']});
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok' && result.image) {
                return `${SMALL_IMAGE_BASE_PATH}${result.image}`;
            }

            return require('../../../assets/svg/default_detail.svg');
        },

        handleActions(row, actionType) {
            switch (actionType) {
                case 'encyDetail':
                    if (row['material_id']) {
                        this.$router.push({
                            name: actionType,
                            params: {
                                id: row['material_id']
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        },

        async handleDetailImageShow(detail) {
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

        async updateDetailsInCart() {
            try {
                const userId = parseInt(window.localStorage.getItem('SEAWATER_USER_ID'));
                const result = (await this.getDetailsByCartId({
                    cartId: this.cart.id
                }))['res'];
                const detailsInStore = JSON.parse(window.localStorage.getItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`));
                const detailsInCart = this.detailList.filter(detail => {
                    for (let item of result) {
                        if (detail.id === item.bill_detail_id) {
                            this.$set(detail, 'count', item['bill_detail_num']);
                            this.$set(detail, 'groupId', this.group.id);
                            return true;
                        }
                    }
                    return false;
                });
                this.detailsInCart = _.unionBy(detailsInCart, detailsInStore, 'id');
                const cartDetailIds = this.getCartDetailsIds();
                this.detailList.map(item => {
                    if (cartDetailIds.indexOf(item.id) === -1) {
                        this.$set(item, 'count', 0);
                    }
                });
            } catch (error) {
                console.error(error);
            }
        },

        alreadyHasCart() {
            if (this.cart === undefined) {
                return false;
            }
            if (!this.cart) {
                return false;
            } else if (!this.cart.id) {
                return false;
            }

            return true;
        },

        groupIsValid() {
            return this.group.status === 1;
        },

        submit() {
            if (!this.detailsInCart || !this.detailsInCart.length) {
                this.$message({
                    type: 'warning',
                    message: `请添加宝贝先！`
                });
                return;
            }
            let {groupId} = this.$route.params;
            groupId = Number(uncompile(groupId));

            this.$refs['cartForm'].validate(async (valid) => {
                if (valid) {
                    this.loading(true);
                    const h = this.$createElement;
                    const error_message = [];
                    const newDetailsInCart = [];
                    try {
                        const nowProvince = window.localStorage.getItem(Seawater_Now_Province)
                            || this.currentUser.province || 'sh';

                        const res = await this.updateUserPhone({
                            id: this.currentUser.id,
                            phone: this.cartForm.telephone,
                            province: nowProvince
                        });
                        if (res.status === 'ok') {
                            this.updateCurrentUser(_.extend({}, this.currentUser, {
                                phone: this.cartForm.telephone
                            }));
                        }

                        const result = await this.updateCart({
                            id: this.cart.id,
                            phone: this.cartForm.telephone,
                            description: this.cartForm.remark || undefined,
                            sum: this.cartCount,
                            status: 1,
                        });
                        if (result.status === 'ok') {
                            for (let detail of this.detailsInCart) {
                                try {
                                    const result = await this.updateCartDetail({
                                        cart_id: this.cart.id,
                                        group_bill_id: this.group.id,
                                        bill_detail_id: detail.id,
                                        bill_detail_num: detail.count
                                    });

                                    if (result.status !== 'ok') {
                                        error_message.push(h('p', null, detail.name))
                                    } else {
                                        newDetailsInCart.push(detail)
                                    }
                                } catch (error) {
                                    console.error(error);
                                    break;
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (error_message.length > 0) {
                        error_message.push(h('p', null, "如果您愿意可以根据当前实时库存继续购买!"));
                        error_message.push(h('p', null, ""));
                        this.$msgbox({
                            title: '以下海鱼或珊瑚，库存不足！',
                            message: h('div', null, error_message),
                            confirmButtonText: '确定',
                        }).then(() => {
                            this.detailsInCart = newDetailsInCart;
                            const userId = parseInt(window.localStorage.getItem('SEAWATER_USER_ID'));
                            window.localStorage.setItem(`SEAWATER_CART_DETAILS_${userId}_${this.group.id}`, JSON.stringify(this.detailsInCart));
                            this.$message({
                                type: 'success',
                                message: `其他海鱼或珊瑚提交成功!`
                            });
                        });
                    } else {
                        this.$message({
                            type: 'success',
                            message: `购物车提交成功!`
                        });
                    }
                    this.groupCount = (await this.getCountById({id: groupId}))[0].sum;
                    this.detailList = await this.getDetailsByBillId({id: this.group.bill_id});
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请检查输入是否正确',
                        offset: 100
                    });
                    return false;
                }
            });
        },
    },

    watch: {
        '$route'(to, from) {
            if (to.name === 'buyPage') {
                this.initData();
            }
            if (from.name === 'buyPage') {
                this.detailsInCart = [];
            }
        },
        'detailsInCart'() {
            this.getCartDetailsIds();
            this.calculateCartCount();
            this.updateDetailsImg();
            const input_parent = $(".one-cart-ency");
            if (input_parent.length >= 1) {
                const inputs = input_parent.find("input");
                if (inputs.length >= 1) {
                    $.each(inputs, function (i, n) {
                        $(this).attr("readonly", "readonly");
                    })
                }
            }

        }
    }
}
