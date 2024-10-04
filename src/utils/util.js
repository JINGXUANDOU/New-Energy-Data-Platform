
/**
 * 将阿拉伯数字翻译成中文的大写数字
 */
export const numberToChinese = (num) => {
    var AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    var BB = ['', '十', '百', '仟', '萬', '億', '点', ''];
    var a = ('' + num).replace(/(^0*)/g, '').split('.');
    var k = 0;
    var re = '';
    for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0:
                re = BB[7] + re;
                break;
            case 4:
                if (!new RegExp('0{4}//d{' + (a[0].length - i - 1) + '}$')
                    .test(a[0]))
                    re = BB[4] + re;
                break;
            case 8:
                re = BB[5] + re;
                BB[7] = BB[5];
                k = 0;
                break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
            re = AA[0] + re;
        if (a[0].charAt(i) != 0)
            re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
    }

    if (a.length > 1) // 加上小数部分(如果有小数部分)
    {
        re += BB[6];
        for (var i = 0; i < a[1].length; i++)
            re += AA[a[1].charAt(i)];
    }
    if (re == '一十')
        re = '十';
    if (re.match(/^一/) && re.length == 3)
        re = re.replace('一', '');
    return re;
};

// --------------------------------日期相关---------------------------------------
/**
 * 日期格式化
 * YYYY-mm-dd HH:MM:SS
 */
export const dateFormat = (fmt, date) => {
    let ret;
    const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
    }
    return fmt;
};
