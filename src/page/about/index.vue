<template>
    <div id="dowebok">
        <div class="section">
            <img src="../../assets/img/about/0.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/01.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/02.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/03.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/04.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/05.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/1.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/2.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/3.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/4.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/5.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/6.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/7.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/8.png">
        </div>
        <div class="section">
            <img src="../../assets/img/about/9.png">
        </div>
    </div>
</template>
<script>
    export default {
        mounted() {
            $('#dowebok').fullpage();
        }
    }
</script>
<style lang="less">
    #dowebok {
        img {
            height: auto;
            display: block;
            margin: 0 auto;
        }
        @media screen and (max-width: 768px) {
            img {
                width: 100%;
            }
        }
        @media screen and (min-width: 768px) {
            img {
                width: 80%;
            }
        }
    }
</style>
