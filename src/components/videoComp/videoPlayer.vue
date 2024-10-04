<!--
*@vediojs
*@author whl
*@date 2024/5/13 19:15
-->
<template>
    <div class="myVideo">
        <video id="videoPlayer"
               class="video-js vjs-default-skin"
               controls playsinline
               width="560px"
               height="320px">
        </video>
    </div>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flash'

export default {
    name: 'devicePlayer',
    data() {
        return {
            player: null,
            options: {
                muted: true, // 设置了它为true，才可实现自动播放,同时视频也被静音（Chrome66及以上版本，禁止音视频的自动播放）
                controls: true, // 显示播放的控件
                autoplay: false, // 设置自动播放
                loop: true,
                languages: {
                    'zh-CN': require('video.js/dist/lang/zh-CN.json')
                },
                language: 'zh-CN',
                preload: 'auto' // 预加载
            },
            attachmentLink: null
        };
    },
    mounted() {
        // 使用 $nextTick 解决vedio报错  The element or ID supplied is not valid. (videojs)
        this.$nextTick(() => {
            this.loadVideo();
        });
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose() // Removing Players,该方法会重置videojs的内部状态并移除dom
        }
    },
    activated() {
        if (this.player) {
            this.player.play()
        }
    },
    deactivated() {
        if (this.player) {
            this.player.pause()
        }
    },
    methods: {
        loadVideo() {

            if (SYSTEM_CONFIG.video_URL == '') {
                // this.attachmentLink = require('@/assets/demo1.mp4')
                // this.options.sources = [{src: this.attachmentLink, type: 'video/mp4'}]
            } else {
                this.attachmentLink = SYSTEM_CONFIG.video_URL
                if (this.attachmentLink.endsWith('.m3u8')) {
                    this.options.sources = [{src: this.attachmentLink, type: 'application/x-mpegURL'}]
                } else if (this.attachmentLink.endsWith('.rtmp')) {
                    this.options.sources = [{src: this.attachmentLink, type: 'rtmp/flv'}] // 告诉videojs这是一个rtmp流视频
                }
            }
            this.player = videojs('videoPlayer', this.options);
        },
        // 销毁
        beforeDestroy() {
            if (this.dp) {
                this.dp.dispose(); // dispose()会直接删除Dom元素
            }
        }
    }
};
</script>

<style lang="less" scoped>
.video-box {
    width: 100%;
    max-width: 600px;
    max-height: 500px;
}

::v-deep .video-js {
    width: 560px;
    height: 320px;
}

// 暂停播放按钮居中
::v-deep .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
