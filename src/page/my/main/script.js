import {mapGetters, mapActions} from 'vuex';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, mapKey, mapCode} from '@/utils/common';
import {SMALL_IMAGE_BASE_PATH, AVATAR_BASE_PATH, Seawater_Pay_Types, Seawater_Yes_No,
    Seawater_Provinces, Seawater_Levels} from '@/constants/index';

export default {
    data() {
        return {
            activeName: 'group',
            groupList: [],
            payTypes: [],
            yesOrNo: [],
            levels: [],
            encyList: [],
            billList: [],
            usersLssAndPfs: [],
            usersLssAndPfsInCity: [],
            imageList: [],
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    async created() {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Pay_Types)) {
                this.payTypes = getFromLocalStorage(Seawater_Pay_Types);
            } else {
                this.payTypes = await this.getPayTypes();
                saveToLocalStorage(Seawater_Pay_Types, this.payTypes);
            }
            if (localStorageHasKey(Seawater_Yes_No)) {
                this.yesOrNo = getFromLocalStorage(Seawater_Yes_No);
            } else {
                this.yesOrNo = await this.getYesOrNo();
                saveToLocalStorage(Seawater_Yes_No, this.yesOrNo);
            }
            if (localStorageHasKey(Seawater_Levels)) {
                this.levels = getFromLocalStorage(Seawater_Levels);
            } else {
                this.levels = await this.getLevels();
                saveToLocalStorage(Seawater_Levels, this.levels);
            }

            this.imageList = [];
            for (let i = 0; i < 4; i++) {
                const {image, id} = await this.getEncyRandomImage();
                if (image) {
                    this.imageList.push({
                        encyId: id,
                        src: `${SMALL_IMAGE_BASE_PATH}${image}`,
                    });
                }
            }
            if (this.imageList.length === 0) {
                this.imageList.push({
                    src: require('../../../assets/svg/default_detail.svg')
                });
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
            'getLevels',
            'getUsersByType',
            'getUserList',
            'getEncyList',
            'getEncyRandomList',
            'getBillList',
            'getGroupList',
            'getEncyRandomImage',
            'getUserAvatar'
        ]),

        async initData() {
            this.loading(true);
            try {
                const result = (await this.getUserList({
                    type1: 'lss',
                    type2: 'pfs',
                }))['users'];
                this.usersLssAndPfs = [];
                if (result && result.length) {
                    if (result.length > 5) {
                        this.usersLssAndPfs = result.slice(0, 5);
                    } else {
                        this.usersLssAndPfs = result;
                    }
                }
                this.usersLssAndPfs.map(async item => {
                    const avatarImgPath = (await this.getUserAvatar({id: item.id})).imgPath;
                    avatarImgPath && (this.$set(item, 'avatarImgPath', `${AVATAR_BASE_PATH}${avatarImgPath}?${Math.random()}`));
                });
                this.encyList = await this.getEncyRandomList({number: 10}) || [];
                this.billList = (await this.getBillList({page: 1, size: 10}))['bills'] || [];
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.initUsersData();
        },

        async initUsersData() {
            const {nowProvince} = this.currentUser;
            let result = [];

            this.loading(true);
            try {
                result = await this.getGroupList({
                    page: this.page,
                    size: this.size,
                    province: nowProvince
                });
                const userResult = (await this.getUserList({
                    type1: 'lss',
                    type2: 'pfs',
                    province: nowProvince
                }))['users'];

                this.usersLssAndPfsInCity = [];
                if (userResult && userResult.length) {
                    if (userResult.length > 5) {
                        this.usersLssAndPfsInCity = userResult.slice(0, 5);
                    } else {
                        this.usersLssAndPfsInCity = userResult;
                    }
                }
                this.usersLssAndPfsInCity.map(async item => {
                    const avatarImgPath = (await this.getUserAvatar({id: item.id})).imgPath;
                    avatarImgPath && (this.$set(item, 'avatarImgPath', `${AVATAR_BASE_PATH}${avatarImgPath}?${Math.random()}`));
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.groupList = result.res || [];
            if (this.groupList.length > 10) {
                this.groupList = this.groupList.slice(0, 10);
            }
        },

        handleActions(row, actionType) {
            switch (actionType) {
                case 'buyPage':
                    this.$router.push({
                        name: actionType,
                        params: {
                            groupId: row.id
                        }
                    });
                    break;
                case 'groupAdd':
                case 'billDetail':
                case 'userDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        }
                    });
                    break;
            }
        },

        handleTabMore() {
            this.$router.push({
                name: `${this.activeName}List`
            });
        },

        handleMore(pageName, queryParams) {
            const params = {
                name: pageName,
            };
            if (queryParams) {
                params.query = queryParams;
            }
            this.$router.push(params);
        },

        goToEncyDetail(encyId) {
            this.$router.push({
                name: 'encyDetail',
                params: {
                    id: encyId
                }
            });
        },

        mapLevel(levelCode) {
            return mapCode(levelCode, this.levels);
        },
    },

    watch: {
        '$route'(to) {
            if (to.name === 'mainPage') {
                this.initData();
            }
        },

        'currentUser.nowProvince': {
            handler: function () {
                this.initUsersData();
            }
        }
    }
}