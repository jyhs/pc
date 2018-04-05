import {mapGetters, mapActions} from 'vuex';
import {SMALL_IMAGE_BASE_PATH} from '@/constants/index';

export default {
    data () {
        return {
            bill: {},
            detailList: [],
            imagePath: '',
            preDetail: {},
            activeNames: ['info', 'billDetails']
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },


    created () {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getBillById',
            'getDetailsByBillId',
            'getEncyImageById'
        ]),

        async initData() {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.bill = (await this.getBillById({id})) || {};
                this.detailList = await this.getDetailsByBillId({id});
            } catch (error) {
                console.error(error);
            }
            this.loading(false);
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
            if (to.name === 'billDetail') {
                this.initData();
            }
        }
    }
}