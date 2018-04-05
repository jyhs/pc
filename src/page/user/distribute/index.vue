<template>
    <div>
        <visitor-pie v-if="currentUser.type==='yhgly'"></visitor-pie>
        <el-row class="card-container" v-else>
            抱歉，404
        </el-row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import visitorPie from '@/components/visitorPie';

    export default {
        computed: {
            ...mapGetters(['currentUser'])
        },

        components: {
            visitorPie
        }
    }
</script>
