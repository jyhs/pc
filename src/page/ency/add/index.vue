<template>
    <div>
        <basic-info v-if="currentUser.type==='bkgly'"></basic-info>
        <el-row class="card-container" v-else>
            抱歉，404
        </el-row>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import basicInfo from './basicInfo/index';

    export default {
        data() {
            return {
                category: {}
            }
        },

        computed: {
            ...mapGetters(['currentUser'])
        },

        components: {
            basicInfo
        }
    }
</script>