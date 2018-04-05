import {mapGetters, mapActions} from 'vuex';
import {quillEditor} from 'vue-quill-editor';
import _ from 'lodash';
import RegExp from '@/constants/regExp';
import {Seawater_Categories, Seawater_Levels, Seawater_Compatibilities} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage, mapCode} from '@/utils/common';

export default {
    data() {
        const validateMoney = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入参考价'));
            } else if (!RegExp.MoneyReg.test(value)) {
                callback(new Error('请输入正确的价格'));
            } else {
                callback();
            }
        };

        return {
            editForm: {
                name: '', //生物名称
                ename: '', //英文名
                sname: '', //学名
                category: '', //分类
                type: '',
                tag: '',
                code: '',
                price: '',
                level: '',
                compatibility: '',
                description: 'TA很懒，什么都没留下~~~'
            },
            rules: {
                name: [
                    {required: true, message: '请输入生物名', trigger: 'blur'},
                ],
                category: [
                    {required: true, message: '请选择分类', trigger: 'change'},
                ],
                type: [
                    {required: true, message: '请选择小类', trigger: 'change'},
                ],
                /*
                tag: [
                    {required: true, message: '请输入标签', trigger: 'blur'},
                ],
                */
                code: [
                    {required: true, message: '请输入编码', trigger: 'blur'},
                ],
                price: [
                    {required: true, message: '请输入参考价', trigger: 'blur'},
                    {validator: validateMoney, trigger: 'blur'}
                ],
                level: [
                    {required: true, message: '请选择饲养难度', trigger: 'change'}
                ],
                compatibility: [
                    {required: true, message: '请选择是否兼容', trigger: 'change'}
                ],
                description: [
                    {required: true, message: '请输入简介', trigger: 'blur'}
                ]
            },
            categories: [],
            types: [],
            compatibilities: [],
            levels: [],
            editorOption: {
                placeholder: "请输入简介，支持html",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, { 'list': 'bullet'}],
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'color': []}, { 'background': []}],
                        [{'font': [] }],
                        [{'align': []}],
                        ['link'],
                        ['clean']
                    ]
                }
            },
            dialogVisible: false,
            encyEditing: {}
        }
    },

    computed: {
        ...mapGetters(['currentUser'])
    },

    components: {
        quillEditor
    },

    async created() {
        this.loading(true);
        try {
            if (localStorageHasKey(Seawater_Categories)) {
                this.categories = getFromLocalStorage(Seawater_Categories);
            } else {
                this.categories = await this.getCategories();
                saveToLocalStorage(Seawater_Categories, this.categories);
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
            'getCategories',
            'getTypesByCategoryCode',
            'getCompatibilities',
            'getLevels',
            'getEncyById',
            'updateEncy'
        ]),

        async initData() {
            const {id} = this.$route.params;

            this.loading(true);
            try {
                this.encyEditing = await this.getEncyById({id});
                this.editForm = _.extend({}, this.encyEditing, {
                    price: this.encyEditing.price ? this.encyEditing.price.toString() : '0'
                });
            } catch(error) {
                console.error(error);
            }
            this.loading(false);
        },

        async handleCategoryChange() {
            const {category} = this.editForm;

            try {
                this.types = await this.getTypesByCategoryCode({categoryCode: category});
                if (category !== this.encyEditing.category) {
                    this.editForm.type = '';
                }
            } catch (error) {
                console.error(error);
            }
        },

        handleUpdate() {
            if (_.isEqual(this.editForm, this.encyEditing)) {
                this.$message({
                    type: 'success',
                    message: `修改生物${this.encyEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({name: 'encyList'});
            } else {
                this.$refs['editForm'].validate(async (valid) => {
                    if (valid) {
                        this.dialogVisible = true;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '请检查输入的信息'
                        });
                    }
                });
            }
        },

        handleCancelEdit() {
            this.encyEditing = {};
            this.$router.push({name: 'encyList'});
        },

        async handleConfirm() {
            this.dialogVisible = false;
            let result = {};

            this.loading(true);
            try {
                result = await this.updateEncy(_.extend({
                    id: this.$route.params.id,
                }, this.editForm));
            } catch(error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.$message({
                    type: 'success',
                    message: `修改生物${this.encyEditing.name}成功`,
                    duration: 5000
                });
                this.$router.push({name: 'encyList'});
            }
        }
    },

    watch: {
        '$route'(to) {
            if (to.name === 'encyEdit') {
                this.initData();
            }
        }
    }
}