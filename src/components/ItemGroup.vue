<template>
  <transition-group
    :name="'slide-right'"
    mode="in-out"
    tag="div"
    class="sidebar__content"
  >
    <div v-if="currentItem === keyId" class="item-group" :key="keyId">
      <div class="item-list">
        <template v-for="(item, index) in list[keyId]">
          <div
            v-if="item.hasChildren"
            :key="keyId + index.toString()"
            class="nav-item"
            @click="slideNext(item.id)"
          >
            <div>{{ item.title }}</div>
          </div>
          <div v-else :key="keyId + index.toString()" class="nav-item">
            {{ item.title }}
          </div>
        </template>
      </div>
    </div>
    <item-group
      v-if="clickedItem && clickedItem.id && currentItem === clickedItem.id"
      :key-id="clickedItem.id"
      :list="createNewList(clickedItem)"
      :new-list="createNewList(clickedItem)"
      :nav="clickedItem.children"
      :key="clickedItem.id"
    />
  </transition-group>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";

interface Nav {
  id: string;
  title: string;
  children?: Nav[];
}

interface List {
  [key: string]: ListItem[];
}

interface ListItem {
  id: string;
  title: string;
  hasChildren: boolean;
}

export default Vue.extend({
  name: "ItemGroup",
  data() {
    return {
      slideAnimation: "slide-right",
      currentItem: "",
      clickedItem: {}
    };
  },
  props: {
    list: {
      required: true
    } as PropOptions<List>,
    keyId: {
      required: true,
      type: String
    },
    newList: {
      required: true
    } as PropOptions<List>,
    nav: {
      required: true
    } as PropOptions<Nav[]>
  },
  methods: {
    createNewList(item: Nav): List {
      const list: List = {};
      if (item.children) {
        this.createList(list, item.children, item.id);
        console.log("new list", list);
      }
      return list;
    },
    slideNext(itemId: string) {
      const item = this.findItemByKey(itemId, this.nav);
      if (item) {
        this.clickedItem = item;
      }
      this.currentItem = itemId;
      this.$emit("slide", { animation: "slide-left", currentItem: itemId });
    },
    createList(list: List, nav: Nav[], key = "main") {
      const obj: List = {
        [key]: []
      };
      for (const item of nav) {
        obj[key].push({
          id: item.id,
          title: item.title,
          hasChildren: !!item.children && item.children.length > 0
        });
      }
      Object.assign(list, obj);
    },
    listHasKeys(list: List): boolean {
      console.log("listHasKeys", Object.keys(list).length);
      return Object.keys(list).length > 0;
    },
    itemHasChildren(item: Nav): boolean {
      console.log(
        "itemHasChildren",
        !!item.children && item.children.length > 0
      );

      return !!item.children && item.children.length > 0;
    },
    findItemByKey(key: string, list: Nav[]): Nav | null {
      let result: Nav | null = null;
      for (const item of list) {
        if (item.id === key) {
          result = item;
          break;
        } else {
          if (this.itemHasChildren(item)) {
            result = this.findItemByKey(key, item.children as Nav[]);
            if (result) {
              break;
            }
          }
        }
      }
      console.log("findItemByKey", result);
      return result;
    },
    getCurrentChildren(key: string, list: Nav[]): Nav[] {
      const item: Nav | null = this.findItemByKey(key, list);
      if (item && item.children) {
        return item.children;
      }
      return [];
    },
    render(list: List, nav: Nav[], key: string) {
      this.createList(list, this.getCurrentChildren(key, nav), key);
      this.next(key);
    },
    next(item: string): void {
      this.slideAnimation = "slide-left";
      this.currentItem = item;
    }
  },
  mounted() {
    console.log(this.keyId);
    this.currentItem = this.keyId;
  }
});
</script>
