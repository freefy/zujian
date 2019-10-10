<template>
  <div style="width:100%;height:100%">
    <el-dropdown trigger="click" placement="bottom-start" ref="dsDropdown">
      <span class="el-dropdown-link">
        <div class="ds-cascader-trigger clearfix" @click="clickFun">
          选择品牌
          <div style="height:100%;" class="float-r">
            <i class="el-icon-caret-bottom"></i>
          </div>
        </div>
      </span>
      <el-dropdown-menu slot="dropdown" class="ds-cascader">
        <!-- 一级菜单 -->
        <ul class="ds-cascader-block">
          <li
            v-for="(item,index) in brandList"
            :key="index"
            :class="{ active: activeItem == index }"
            class="block-item clearfix"
            @click="handleItemClick(index)"
          >
            {{item.category}}
            <i class="el-icon-arrow-right float-r"></i>
          </li>
        </ul>
        <!-- 二级菜单 -->
        <div class="ds-cascader-block" style="min-width:240px;" v-show="activeItem !== null">
          <div class="sub-block-wrap">
            <div class="sub-block-item" v-for="(item,cindex) in subMap" :key="cindex">
              <p class="title clearfix" @click="handleSubItemClick(item)">
                <i :class="item.active ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>
                {{item.subcategory}}
                <el-checkbox
                  class="ds-checkbox float-r"
                  v-model="item.checkAll"
                  @change="checked => handleCheckAllChange(checked, item.brands,item)"
                ></el-checkbox>
              </p>
              <div class="third-wrap" v-show="item.active">
                <div
                  class="third-item clearfix"
                  v-for="(brand,brandIndex) in item.brands"
                  :key="brandIndex"
                  @click="handleThirdItemClick"
                >
                  {{brand}}
                  <el-checkbox
                    v-model="brands"
                    :label="brand"
                    @change="changeType(item)"
                    :disabled="checkboxDisable(brand)"
                    class="ds-checkbox no-label float-r"
                  ></el-checkbox>
                </div>
              </div>
            </div>
          </div>
          <p class="text-center" style="padding:20px;" v-if="subMap.length == 0">暂无数据</p>
          <div class="block-footer clearfix" v-if="subMap.length != 0">
            <span>
              还能选择
              <span style="color:#608fe9;">{{10 - brands.length}}</span>项
            </span>
            <el-button class="ds-btn main rect small float-r" @click="confirm">确定</el-button>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="ds-cascader-tag-wrap">
      <span class="selected-tag" v-for="(tag,tagIndex) in confirmedBrands" :key="tagIndex">
        {{tag}}
        <i class="el-icon-close" @click="deleteConfirmedTag(tag)"></i>
      </span>
    </div>
  </div>
</template>
<script>
import dataList from "@/mock/brands";
export default {
  //   name: "333",
  data() {
    return {
      brandList: [],
      activeItem: null,
      subMap: [],
      categoryIndex: null, // 已选择的品类，为下面的期数和维度作准备
      brands: [], // 已选择的品牌
      confirmedBrands: []
    };
  },
  methods: {
    // 一级菜单点击---显示二级菜单
    handleItemClick(index) {
      if (this.activeItem == index) {
        this.activeItem = null;
        return;
      }
      //切换激活的项
      this.activeItem = index;
      //因为不能跨品类选择，所以要清空model
      this.brands = [];

      // 设置2级菜单，并重置
      if (this.activeItem === null) {
        this.subMap = [];
      }
      this.subMap = this.brandList[this.activeItem].subcategories;
      // this.resetSubMapCheckAll();
    },
    // 二级菜单点击
    handleSubItemClick(item) {
      item.active = !item.active;
    },
    // 三级菜单点击，点击整一个子项的时候，通过jquery找到下面的input元素，并触发input的点击事件
    handleThirdItemClick(e) {
      // if ($(e.target).prop("tagName") == "DIV") {
      //   $($(e.target).find("input")[0]).trigger("click");
      // }
    },
    // 二级菜单旁边的checkbox，点击之后全选或者全不选下面的品类
    handleCheckAllChange(checked, brands, brandItem) {
      brandItem.active = true;
      // 获取当前选择的品牌
      let temp = [...this.brands];
      brands.forEach(brand => {
        let index = temp.indexOf(brand);
        if (checked === true) {
          // 可选择数量上限是10
          index < 0 && temp.length < 10 && temp.push(brand);
        } else {
          // 找到了才删，splice(-1, 1) => 删除最后一项
          index >= 0 && temp.splice(index, 1);
        }
      });
      // 去重以防万一
      this.brands = [...new Set(temp)];
    },
    // 切换一级菜单和确认了之后，重置一下二级菜单旁边的checkbox
    resetSubMapCheckAll() {
      this.subMap = this.subMap.map(el => {
        return Object.assign({}, el, { checkAll: false });
      });
    },
    //删除已选择的品牌
    deleteConfirmedTag(tag) {
      this.confirmedBrands = this.confirmedBrands.filter(el => {
        return el != tag;
      });
      this.brands = [...this.confirmedBrands];
      this.$emit("change", {
        category: this.brandList[this.categoryIndex],
        brands: this.confirmedBrands
      });
    },
    // 每次只能选择最多10个品牌
    checkboxDisable(label) {
      if (this.brands.includes(label)) {
        return false;
      }
      return this.brands.length >= 10;
    },
    confirm() {
      this.$refs.dsDropdown.hide();
      // this.resetSubMapCheckAll();

      this.confirmedBrands = [...this.brands];
      // this.brands = [];

      //记录一下选择了哪个品类
      this.categoryIndex = this.activeItem;
      this.$emit("change", {
        category: this.brandList[this.categoryIndex],
        brands: this.confirmedBrands
      });
    },
    changeType(item) {
      let count = 0;
      let len = item.brands.length;
      item.brands.forEach(el => {
        if (this.brands.includes(el)) {
          count++;
        }
      });
      if (count == len) {
        item.checkAll = true;
      } else {
        item.checkAll = false;
      }
    },
    clickFun() {
      this.brandList.forEach(el => {
        el.subcategories.forEach(em => {
          if (em.checkAll) {
            let count = 0;
            let len = em.brands.length;
            em.brands.forEach(ek => {
              if (this.brands.includes(ek)) {
                count++;
              }
            });
            if (count == len) {
              em.checkAll = true;
            } else {
              em.checkAll = false;
            }
          }
        });
      });
    }
  },
  mounted() {
    init.call(this);
  },
  watch: {}
};
function init() {
  let brandList = dataList.dataList;
  // 第二层级需要有全选功能；active,checkAll是否选中，active用于样式选中，checkALL用于功能实现
  brandList.forEach(el => {
    el.subcategories = el.subcategories.map(el2 => {
      return Object.assign({}, el2, { active: false, checkAll: false });
    });
  });
  this.brandList = brandList;
}
</script>

<style lang="less">
ul {
  list-style: none;
}
.float-r {
  float: right;
}

.ds-checkbox {
  .el-checkbox__label {
    font-size: 12px;
    padding-left: 7px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #608fe9;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #608fe9;
    border-color: #608fe9;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #608fe9;
  }
  .el-checkbox__inner:hover {
    border-color: #608fe9;
  }
  &.no-label {
    .el-checkbox__label {
      display: none;
    }
  }
}
.ds-cascader {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0;
  box-shadow: none;
  color: #666;
  .ds-cascader-block {
    font-size: 12px;
    padding: 5px 0;
    min-width: 160px;
    display: inline-block;
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    background-color: #fff;
    vertical-align: top;
  }
  .block-item {
    padding: 7px;
    cursor: pointer;

    position: relative;
    &:hover,
    &.active {
      background-color: #e4e8f1;
    }
    &.dashedTop {
      border-top: 1px dashed #e4e8f1;
    }
    &.selected {
      background-color: #e4e8f1;
      color: #4275d6;
      font-weight: 700;
    }
  }
  .sub-block-wrap {
    max-height: 268px;
    overflow: auto;
  }
  .sub-block-item {
    padding: 0 7px;
    .third-wrap {
      padding-left: 20px;
    }
    .title,
    .third-item {
      padding: 5px;
      cursor: pointer;
      line-height: 16px;
      &:hover {
        background-color: #e4e8f1;
      }
    }
  }
  .block-footer {
    margin-top: 5px;
    padding: 5px 12px 0;
    line-height: 26px;
    border-top: 1px solid #d3d3d3;
  }
}
.ds-cascader-tag-wrap {
  display: inline-block;
  .selected-tag {
    display: inline-block;
    color: #738edf;
    background: #ebf5ff;
    border: 1px solid #c9e4ff;
    padding: 5px 10px;
    border-radius: 24px;
    margin: 3px 0;
    margin-right: 5px;
    .el-icon-close {
      margin-left: 7px;
      cursor: pointer;
      &:hover {
        background-color: #daecff;
      }
    }
  }
}
</style>

