<template>
    <div>
        <el-form>
            <el-form-item label="ATRs">
                <el-button type="primary" @click="ATRs.push(ATRData())">Add</el-button>
            </el-form-item>
            <template v-for="(atr, index) in ATRs">
                <el-form-item :label="getATRPercentage(atr.mixed)">
                    <br>
                    <el-form-item label="Name">
                        <el-input v-model="atr.name">Name</el-input>
                    </el-form-item>
                    <el-form-item label="ATR/currentPrize">
                        <el-input v-model="atr.mixed">ATR/currentPrize</el-input>
                    </el-form-item>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                ATRs: [this.ATRData()],
            }
        },
        methods: {
            ATRData() {
                return {
                    name: null,
                    mixed: '',
                };
            },
            getATRPercentage(mixed) {
                let match = mixed.match(/(.+)(\/)(.+)/);
                if (!match) {
                    return '-';
                }

                let atr   = match[1];
                let price = match[3];

                return (atr / price * 100).toFixed(2) + ' %';
            },
        },
        created() {
        }
    }
</script>
