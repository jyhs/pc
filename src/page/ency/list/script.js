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
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            checkedCategories: [],
            filteredTypes: [],
            selectedTypes: ''
        }
    },

    computed: {
        ...mapGetters([
            'currentUser',
            'encyListSearchName'
        ])
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
            this.initFilteredTypes();
        } catch (error) {
            console.error(error);
        }
        this.loading(false);

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getCategories',
            'getTypesByCategoryCode',
            'updateEncyListSearchName',
            'getCompatibilities',
            'getLevels',
            'getEncyList',
            'deleteEncy'
        ]),

        async initData({name, type} = {}) {
            name = name || this.encyListSearchName;
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

        async initFilteredTypes() {
            this.filteredTypes = [];
            for (let category of this.categories) {
                const types = await this.getTypesByCategoryCode({categoryCode: category.code});
                this.filteredTypes.push({
                    name: this.mapCategory(category.code),
                    code: category.code,
                    children: types
                });
            }
        },

        handleSearch() {
            this.$refs['searchForm'].validate(async (valid) => {
                if (valid) {
                    this.updateEncyListSearchName(this.searchForm.name);
                    this.initData({
                        name: this.searchForm.name,
                        type: this.selectedTypes
                    });
                }
            });
        },

        async handleConfirmFilter(which) {
            fireClickEventById(`${which}FilterButton`);
            if (which === 'category') {
                if (this.checkedCategories && this.checkedCategories.length) {
                    this.filteredTypes = [];
                    for (let categoryCode of this.checkedCategories) {
                        const types = await this.getTypesByCategoryCode({categoryCode});
                        this.filteredTypes.push({
                            name: this.mapCategory(categoryCode),
                            code: categoryCode,
                            children: types
                        });
                    }
                }
            } else {
                const selectedTypes = this.$refs['typesTree'].getCheckedKeys();
                if (selectedTypes && selectedTypes.length) {
                    this.selectedTypes = selectedTypes.join(',');
                    this.initData({
                        name: this.searchForm.name,
                        type: this.selectedTypes
                    });
                } else {
                    this.initData({
                        name: this.searchForm.name
                    });
                }
            }
        },

        handleResetFilter(which) {
            fireClickEventById(`${which}FilterButton`);
            if (which === 'category') {
                this.checkedCategories = [];
                this.initFilteredTypes();
            } else {
                this.handleEmptyFilter();
                this.initData({
                    name: this.searchForm.name
                });
            }
        },

        handleEmptyFilter() {
            this.$refs['typesTree'].setCheckedNodes([]);
            this.selectedTypes = '';
        },

        handleReset() {
            this.searchForm.name = '';
            this.initData({type: this.selectedTypes});
        },

        handleAdd() {
            this.$router.push({name: 'encyAdd'});
        },

        handleSizeChange(size) {
            this.size = size;
            this.initData({
                name: this.searchForm.name,
                type: this.selectedTypes
            });
        },

        handleCurrentChange(page) {
            this.page = page;
            this.initData({
                name: this.searchForm.name,
                type: this.selectedTypes
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
                this.handleEmptyFilter();
                this.initData();
            }
        }
    }
}
