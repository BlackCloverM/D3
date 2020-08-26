<template>
  <el-button
    :type="buttonType"
    :size="buttonSize"
    :loading="loading"
    @click="handleClick"
    :disabled="disabled"
    >{{ title }}</el-button
  >
</template>

<script>
import XLSX from "xlsx";
export default {
  name: "kr_excel_export",
  props: {
    // 是否添加序号列
    orderNum: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 按钮类型
    buttonType: {
      type: String,
      default: ""
    },
    // 按钮尺寸
    buttonSize: {
      type: String,
      default: ""
    },
    // 表单名称
    fileName: {
      type: String,
      default: "全部列表.xlsx"
    },
    // 获取数据
    fnGetData: {
      type: Function,
      default: () => {},
      required: true
    },
    // 配置
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    // 按钮文字
    title: {
      type: String,
      default: "导出"
    }
  },
  computed: {
    formatters() {
      return this.config.formatters;
    },
    includes() {
      return this.config.includes;
    },
    fileNameChecked() {
      const reg = /(\.xlsx|\.xls)$/;
      if (reg.test(this.fileName)) {
        let temp = this.fileName.split(".");
        return temp[0] + this.getCurrentTime() + "." + temp[1];
      } else {
        return this.fileName + this.getCurrentTime() + ".xlsx";
      }
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async handleClick() {
      if (!this.fnGetData || this.loading) {
        return;
      }
      this.loading = true;
      const resData = await this.fnGetData(); // 获取列表信息
      this.loading = false;
      if (!resData) {
        this.$message.error("导出数据失败！");
        return;
      }
      if (resData.length === 0) {
        this.$message.error("暂无数据！");
        return;
      }

      const newAllList = this.exportDataFilter(
        resData,
        // testManyData,
        this.includes,
        this.formatters
      ); // 数据构造

      const sheet = XLSX.utils.aoa_to_sheet(newAllList); // 转换为 sheet 对象
      sheet["!cols"] = [
        { wpx: 50 },
        ...widthFormatter(this.includes, this.formatters)
      ];
      this.downloadExcelFlie(this.sheet2blob(sheet), this.fileNameChecked);

      // 格式化单元格列宽
      function widthFormatter(list, option) {
        return list.map(item => {
          if (option[item] && option[item].width) {
            return { wpx: option[item].width };
          } else {
            return { wpx: 80 };
          }
        });
      }
    },

    /**
     * @description 文件下载
     * @param {string, blob} url 下载链接，或是一个 blob 对象
     * @param {string} fileName 保存的文件名
     */
    downloadExcelFlie(url, fileName = "列表.xlsx") {
      if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建 blob地址
      }
      const aLink = document.createElement("a");
      aLink.href = url;
      aLink.download = fileName;

      // 模拟点击事件
      const body = document.getElementsByTagName("body")[0];
      body.appendChild(aLink);
      aLink.click();
      aLink.remove();
    },

    /**
     * @description 将 sheet 对象转换成 blob 类型
     * @param {sheet} sheet sheet对象
     * @param {string} sheetName 表名
     */
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || "sheet1";
      const workbook = {
        SheetNames: [sheetName],
        Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;

      // 生成excel的配置项
      const wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary"
      };
      const wbout = XLSX.write(workbook, wopts);
      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
      });

      // 字符串转ArrayBuffer
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) {
          view[i] = s.charCodeAt(i) & 0xff;
        }
        return buf;
      }
      return blob;
    },

    /**
     * @description 筛选出需要导出的字段，并格式化
     * @param {Array} list 被筛选数据
     * @param {Array} titles 字段名数组
     */
    exportDataFilter(list, includes, formatters) {
      const newList = [];
      const header = this.orderNum ? ["序号"] : [];
      // 构造标题组
      includes.map(item => {
        if (formatters[item] && formatters[item].title) {
          header.push(formatters[item].title);
        } else {
          header.push(item);
        }
      });
      newList.push(header);

      // 筛选相应字段的数据，并格式化
      list.map((item, index) => {
        const temp = this.orderNum ? [index + 1] : [];
        includes.map(it => {
          const value = item[it];

          if (formatters[it] && formatters[it].formatter) {
            temp.push(formatters[it].formatter(value, item));
          } else {
            temp.push(value);
          }
        });
        newList.push(temp);
      });
      return newList;
    },

    // 获取当前时间
    getCurrentTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date
        .getDate()
        .toString()
        .padStart(2, "0");
      const hour = date
        .getHours()
        .toString()
        .padStart(2, "0");
      const minute = date
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const second = date
        .getSeconds()
        .toString()
        .padStart(2, "0");
      return `${year}${month}${day}${hour}${minute}${second}`;
    }
  }
};
</script>

<style lang="scss" module></style>
