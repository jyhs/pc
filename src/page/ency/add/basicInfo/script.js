import {mapActions} from 'vuex';
import {quillEditor} from 'vue-quill-editor';
import RegExp from '@/constants/regExp';
import {Seawater_Categories, Seawater_Levels, Seawater_Compatibilities} from '@/constants/index';
import {localStorageHasKey, saveToLocalStorage, getFromLocalStorage} from '@/utils/common';

export default {
    data() {
        const validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                if (/^[0-9]*$/.test(value)) {
                    callback(new Error('生物名不可以数字开头'));
                } else {
                    this.checkEncyName({name: value}).then(data => {
                        if (data.status === 'ok') {
                            callback();
                        }
                    }).catch(error => {
                        console.error(error);
                        callback(new Error('生物名已被使用'));
                    });
                }
            }
        };
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
            addForm: {
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
                    {validator: validateName, trigger: 'blur'}
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
            }
        }
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
    },

    methods: {
        ...mapActions([
            'loading',
            'getCategories',
            'getTypesByCategoryCode',
            'getCompatibilities',
            'getLevels',
            'checkEncyName',
            'addEncy'
        ]),

        async handleCategoryChange() {
            const {category} = this.addForm;
            try {
                if (category) {
                    this.types = await this.getTypesByCategoryCode({categoryCode: category});
                    this.addForm.type = '';
                }
            } catch (error) {
                console.error(error);
            }
        },

        submitForm() {
            this.$refs['addForm'].validate(async (valid) => {
                if (valid) {
                    this.loading(true);
                    let result = {};
                    try {
                        result = await this.addEncy(this.addForm);
                    } catch (error) {
                        console.error(error);
                    }
                    this.loading(false);

                    if (result.status === 'ok') {
                        this.$message({
                            type: 'success',
                            message: `添加生物${this.addForm.name}成功`
                        });
                        this.$router.push({name: 'encyList'});
                    }
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
        '$route'(to) {
            if (to.name === 'encyAdd') {
                this.$refs['addForm'] && this.$refs['addForm'].resetFields();
            }
        }
    }
}