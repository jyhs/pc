import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import {Seawater_Provinces, Seawater_User_Types} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, mapCode, mapKey} from '@/utils/common';

export default {
    data() {
        return {
            searchForm: {
                name: ''
            },
            provinces: [],
            types: [],
            userList: [],
            currentRow: {},
            totalCount: 0,
            page: 1,
            size: 10,
            dialogVisible: false
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    async created() {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Provinces)) {
                this.provinces = getFromLocalStorage(Seawater_Provinces);
            } else {
                this.provinces = await this.getProvinces();
                saveToLocalStorage(Seawater_Provinces, this.provinces);
            }
            if (localStorageHasKey(Seawater_User_Types)) {
                this.types = getFromLocalStorage(Seawater_User_Types);
            } else {
                this.types = await this.getTypes();
                saveToLocalStorage(Seawater_User_Types, this.types);
            }
        } catch(error) {
            console.error(error);
        }
        this.loading(false);
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getProvinces',
            'getTypes',
            'getUserList',
            'updateUser'
        ]),

        async initData(name) {
            this.loading(true);
            let result = [];
            try {
                result = await this.getUserList({
                    name,
                    page: this.page,
                    size: this.size,
                    ...this.$route.query,
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.userList = result.users || [];
            this.totalCount = result['count'] ? result['count'][0]['count'] : 0;
        },

        handleSearch() {
            this.$refs['searchForm'].validate(valid => {
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

        handleActions (row, actionType) {
            switch (actionType) {
                case 'userEdit':
                case 'userRePass':
                case 'userDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        }
                    });
                    break;
                case 'cartList':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        },
                        query: {
                            userName: row.name
                        }
                    });
                    break;
                case 'delete':
                case 'recover':
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
            if (this.currentRow.status === 0) {
                this.currentRow.status = 1;
            } else {
                this.currentRow.status = 0;
            }

            try {
                const sendInfo = _.extend({}, this.currentRow);
                for (let key of Object.keys(sendInfo)) {
                    if (sendInfo[key] === null) {
                        sendInfo[key] = undefined;
                    }
                }
                delete sendInfo.pay_type;
                delete sendInfo.password;
                result = await this.updateUser(sendInfo);
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `${(this.currentRow.status === 1 ? '恢复' : '删除')}用户${this.currentRow.name}成功`
                });
                this.initData();
            }
        },

        mapCity (cityKey) {
            return mapKey(cityKey, this.provinces);
        },

        mapType (typeCode) {
            return mapCode(typeCode, this.types);
        }
    },

    watch: {
        '$route' (to) {
            if (to.name === 'userList') {
                this.initData();
            }
        },

        /*
        'currentUser': {
            handler: function (curValue) {
                this.$router.push({
                    name: 'userList',
                    query: {
                        ...this.$route.query,
                        city: curValue.city
                    }
                });
            },
            deep: true
        }
        */
    }
}