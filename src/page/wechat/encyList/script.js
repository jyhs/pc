import {mapActions, mapGetters} from 'vuex';
import {Seawater_Categories, Seawater_All_Category_Types, Seawater_Levels,
    Seawater_Compatibilities} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage,
    mapCode, fireClickEventById} from '@/utils/common';

export default {
    data () {
        return {
            searchForm: {
                name: ''
            },
            categories: [],
            compatibilities: [],
            levels: [],
            allTypes: [],
            encyList: [],
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

    async created () {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Categories)) {
                this.categories = getFromLocalStorage(Seawater_Categories);
            } else {
                this.categories = await this.getCategories();
                saveToLocalStorage(Seawater_Categories, this.categories);
            }
            if (localStorageHasKey(Seawater_All_Category_Types)) {
                this.allTypes = getFromLocalStorage(Seawater_All_Category_Types);
            } else {
                this.allTypes = await this.getTypesByCategoryCode({categoryCode: 'all'});
                saveToLocalStorage(Seawater_All_Category_Types, this.allTypes);
            }
            if (localStorageHasKey(Seawater_Compatibilities)) {
                this.compatibilities = getFromLocalStorage(Seawater_Compatibilities);
            } else {
                this.compatibilities = await this.getCompatibilities();
                saveToLocalStorage(Seawater_Compatibilities, this.compatibilities);
            }
            if (localStorageHasKey(Seawater_Levels)) {
                this.levels = getFromLocalStorage(Seawater_Levels);
            } else {
                this.levels = await this.getLevels();
                saveToLocalStorage(Seawater_Levels, this.levels);
            }
        } catch (error) {
            console.error(error);
        }
        this.loading(false);

        const {type} = this.$route.params;
        this.initData({type});
    },

    methods: {
        ...mapActions([
            'loading',
            'getCategories',
            'getTypesByCategoryCode',
            'getCompatibilities',
            'getLevels',
            'getEncyList',
            'deleteEncy'
        ]),

        async initData({name, type} = {}) {
            this.loading(true);
            let result = [];
            try {
                result = await this.getEncyList({name, type, page: this.page, size: this.size});
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            this.encyList = result['materials'] || [];
            this.totalCount = result['count'] ? result['count'][0]['count'] : 0;
        },

        handleSearch() {
            const {type} = this.$route.params;

            this.$refs['searchForm'].validate(async (valid) => {
                if (valid) {
                    this.initData({
                        name: this.searchForm.name,
                        type,
                    });
                }
            });
        },

        handleReset() {
            const {type} = this.$route.params;

            this.searchForm.name = '';
            this.initData({type});
        },

        handleAdd() {
            this.$router.push({name: 'encyAdd'});
        },

        handleSizeChange(size) {
            const {type} = this.$route.params;

            this.size = size;
            this.initData({
                name: this.searchForm.name,
                type,
            });
        },

        handleCurrentChange(page) {
            const {type} = this.$route.params;

            this.page = page;
            this.initData({
                name: this.searchForm.name,
                type,
            });
        },

        handleActions(row, actionType) {
            switch (actionType) {
                case 'encyEdit':
                case 'encyDetail':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id
                        }
                    });
                    break;
                case 'encyPicture':
                    this.$router.push({
                        name: actionType,
                        params: {
                            id: row.id,
                            category: row.category,
                            code: row.code
                        },
                        query: {
                            name: row.name
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
            try {
                result = await this.deleteEncy({
                    id: this.currentRow.id
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `删除生物${this.currentRow.name}成功`
                });
                this.initData();
            }
        },

        mapCategory(categoryCode) {
            return mapCode(categoryCode, this.categories);
        },

        mapType(typeCode) {
            return mapCode(typeCode, this.allTypes);
        },

        mapLevel(levelCode) {
            return mapCode(levelCode, this.levels);
        },

        mapCompatibility(compatibilityCode) {
            return mapCode(compatibilityCode, this.compatibilities);
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'encyList') {
                this.initData();
            }
        }
    }
}