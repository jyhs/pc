import {mapActions} from 'vuex';
import {IMAGE_BASE_PATH, Seawater_Categories, Seawater_All_Category_Types, Seawater_Levels,
    Seawater_Compatibilities} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, mapCode} from '@/utils/common';

export default {
    data() {
        return {
            encyEditing: {},
            encyImages: [],
            categories: [],
            allTypes: [],
            compatibilities: [],
            levels: [],
        }
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

        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'getEncyById',
            'getEncyImagesById',
            'getCategories',
            'getTypesByCategoryCode',
            'getCompatibilities',
            'getLevels',
        ]),

        async initData () {
            this.encyEditing = {};
            this.encyImages = [];
            const {id} = this.$route.params;
            try {
                this.loading(true);
                this.encyEditing = await this.getEncyById({id});
                const encyImages = (await this.getEncyImagesById({id}))['imageList'] || [];
                encyImages.map(image => {
                    this.encyImages.push(`${IMAGE_BASE_PATH}${image}`);
                });
                this.loading(false);
            } catch (error) {
                console.error(error);
            }
        },

        goToUploadPicture () {
            this.$router.push({
                name: 'encyPicture',
                params: {
                    id: this.encyEditing.id,
                    category: this.encyEditing.category,
                    code: this.encyEditing.code
                }
            });
        },

        mapCategory (categoryCode) {
            return mapCode(categoryCode, this.categories);
        },

        mapType (typeCode) {
            return mapCode(typeCode, this.allTypes);
        },

        mapLevel (levelCode) {
            return mapCode(levelCode, this.levels);
        },

        mapCompatibility(compatibilityCode) {
            return mapCode(compatibilityCode, this.compatibilities);
        }
    },

    watch: {
        $route () {
            const {id} = this.$route.params;
            if (id) {
                this.initData();
            }
        }
    }
}