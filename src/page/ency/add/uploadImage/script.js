import {mapActions} from 'vuex';
import headTop from '@/components/headTop';
import {toFormData} from '@/utils/common';

export default {
    data () {
        return {
            imageList: [],
            imgPath: '',
            percent: 0,
            maskShow: [],
            dialogVisible: false,
            currentImage: ''
        }
    },

    components: {
        headTop
    },

    props: ['category'],

    async created() {
        this.initData();
    },

    methods: {
        ...mapActions([
            'loading',
            'imageIsShowing',
            'uploadImage',
            'getImagesByEncyId',
            'deleteImageByEncyId'
        ]),

        async initData () {
            this.loading(true);
            this.maskShow = [];
            let result = {};
            try {
                result = await this.getImagesByEncyId({id: this.category.id});
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.imageList = result.imageList.map((image, index) => {
                    this.maskShow.push({
                        [index]: false
                    });
                    return 'https://111.231.136.250/image/uploads' + image;
                });
                this.maskShow.push({
                    [this.imageList.length]: false
                });
                this.imgPath = '';
            }
        },

        handleMaskIsShow (index, flag) {
            this.maskShow[index][index] = flag;
        },

        async upload () {
            const file = this.$refs['fileToUpload'].files[0];
            if (!file) {
                this.$message({
                    message: '请选择需要上传的图片',
                    type: 'warning'
                });
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                this.$message({
                    message: `${file.name}大小超过2M，请检查`,
                    type: 'warning'
                });
                return;
            }
            const fileType = file.type.substring(file.type.indexOf('/') + 1).toUpperCase();
            if (['BMP', 'JPG', 'JPEG', 'PNG', 'GIF'].indexOf(fileType) === -1) {
                this.$message({
                    message: `${file.name}文件不是图片，请检查`,
                    type: 'warning'
                });
                return;
            }

            const {id, category, code} = this.category;
            let result = {};
            this.loading(true);
            try {
                result = await this.uploadImage({
                    formData: toFormData({
                        img: file,
                        id,
                        category,
                        code
                    }),
                    progressCallback: this.uploadProgress
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.imgPath = `https://111.231.136.250/image/uploads${result.imgPath}`;
                this.initData();
                this.$message({
                    message: `上传${file.name}成功`,
                    type: 'success'
                });
            }
        },

        uploadProgress (percent) {
            this.percent = percent;
        },

        handleSearch (image) {
            this.imageIsShowing({
                show: true,
                path: image
            });
        },

        handleDelete (image) {
            this.currentImage = image.substring(image.lastIndexOf('/') + 1);
            this.dialogVisible = true;
        },

        handleCancel () {
            this.currentImage = '';
            this.dialogVisible = false;
        },

        async handleConfirm () {
            this.dialogVisible = false;
            this.loading(true);
            let result = {};
            try {
                result = await this.deleteImageByEncyId({
                    id: this.category.id,
                    imgName: this.currentImage
                });
            } catch (error) {
                console.error(error);
            }
            this.loading(false);

            if (result.status === 'ok') {
                this.initData();
                this.$message({
                    message: `删除图片${this.currentImage}成功`,
                    type: 'success'
                });
            }
        }
    },

    watch: {
        '$route'() {
            if (this.category.id) {
                this.initData();
            }
        }
    }
}