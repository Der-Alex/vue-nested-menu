<template>
  <div id="app">
    <div class="sidebar">
      <h2>Sidebar</h2>
      <hr />
      <div class="sidebar__container">
        <div class="nav-item" @click="prev('main')">
          &lt; Back | Current Item {{ currentSelectedItem }}
        </div>

        <hr />

        <!--        <transition-group
          :name="slideAnimation"
          mode="in-out"
          tag="div"
          class="sidebar__content"
        >
          <template v-if="allDone">
            <item-group
              v-if="currentItem === getMainListKey"
              :key="getMainListKey"
              :key-id="getMainListKey"
              :list="mainList"
              :nav="menu"
              :new-list="mainList"
              @slide="slide"
            />
            <template v-for="key in getChildListKeys">
              <item-group
                v-if="currentItem === key"
                :key="key"
                :key-id="key"
                :list="childList"
                :nav="menu"
                :new-list="mainList"
                @slide="slide"
              />
            </template>
            <component
              v-for="(comp, index) in myComponents"
              :is="comp.instance"
              v-bind="comp.props"
              :key="index"
            />
          </template>
        </transition-group>-->

        <!--        <transition-group
          :name="slideAnimation"
          mode="in-out"
          tag="div"
          class="sidebar__content"
        >
          <div v-if="currentItem === 'A'" class="item-group" key="A">
            <div class="nav-item" @click="next('A-A')">Item A</div>
            <div class="nav-item" @click="next('A-B')">Item B</div>
            <div class="nav-item" @click="next('A-C')">Item C</div>
          </div>

          <div v-if="currentItem === 'A-A'" class="item-group" key="A-A">
            <div class="nav-item">Item A-1</div>
            <div class="nav-item">Item A-2</div>
            <div class="nav-item">Item A-3</div>
          </div>
          <div v-if="currentItem === 'A-B'" class="item-group" key="A-B">
            <div class="nav-item">Item B-1</div>
            <div class="nav-item">Item B-2</div>
            <div class="nav-item">Item B-3</div>
          </div>
          <div v-if="currentItem === 'A-C'" class="item-group" key="A-C">
            <div class="nav-item">Item C-1</div>
            <div class="nav-item">Item C-2</div>
            <div class="nav-item">Item C-3</div>
          </div>
        </transition-group>-->

        <template v-if="allDone">
          <item-group
            v-if="currentItem === getMainListKey"
            :key="getMainListKey"
            :key-id="getMainListKey"
            :list="mainList"
            :nav="menu"
            :new-list="mainList"
            @slide="slide"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { VueConstructor } from "vue";
import ItemGroup from "@/components/ItemGroup.vue";
import { CombinedVueInstance } from "vue/types/vue";

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

const menu: Nav[] = [
  {
    id: "abc1",
    title: "Products",
    children: [
      {
        id: "pa",
        title: "Product A"
      },
      {
        id: "pb",
        title: "Product B",
        children: [
          {
            id: "spb1",
            title: "Sub Product B-1"
          },
          {
            id: "spb2",
            title: "Sub Product B-2"
          }
        ]
      },
      {
        id: "pc",
        title: "Product C",
        children: [
          {
            id: "spc1",
            title: "Sub Product C-1"
          },
          {
            id: "spc2",
            title: "Sub Product C-2"
          },
          {
            id: "spc3",
            title: "Sub Product C-3"
          }
        ]
      }
    ]
  },
  {
    id: "abc2",
    title: "Branches",
    children: [
      {
        id: "ba",
        title: "Branch A"
      },
      {
        id: "bb",
        title: "Branch B",
        children: [
          {
            id: "sbb1",
            title: "Sub Branch B-1"
          },
          {
            id: "sbb2",
            title: "Sub Branch B-2"
          }
        ]
      }
    ]
  }
];

export default Vue.extend({
  name: "App",
  components: {
    ItemGroup
  },
  data() {
    const mainList: List = {};
    const childList: List = {};
    const currentChildNav: Nav[] = [];
    const myComponents: {
      instance: CombinedVueInstance<any, any, any, any, any>;
      props: { keyId: string; list: List; nav: Nav[]; newList: List };
    }[] = [];
    return {
      currentItem: "A",
      slideAnimation: "slide-right",
      menu,
      mainList,
      childList,
      currentChildNav,
      allDone: false,
      myComponents,
      currentSelectedItem: ""
    };
  },
  computed: {
    getMainListKey(): string {
      console.log("getMainListKey", Object.keys(this.mainList)[0]);
      return Object.keys(this.mainList)[0];
    },
    getChildListKeys(): string[] {
      console.log("getChildListKeys", Object.keys(this.childList));
      return Object.keys(this.childList);
    }
  },
  methods: {
    slide(config: { animation: string; currentItem: string }) {
      console.log("slide called");
      //this.slideAnimation = config.animation;
      this.currentSelectedItem = config.currentItem;
    },
    next(item: string): void {
      this.slideAnimation = "slide-left";
      this.currentItem = item;
    },
    prev(item: string): void {
      this.slideAnimation = "slide-left";
      this.currentSelectedItem = item;
      this.currentItem = 'main';
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
    }
  },
  mounted() {
    this.createList(this.mainList, this.menu);
    for (const item of menu) {
      if (item.children && item.children.length > 0) {
        this.createList(this.childList, item.children, item.id);
      }
    }
    console.log(this.mainList);
    console.log(this.childList, Object.keys(this.childList));
    this.currentItem = this.getMainListKey;
    this.allDone = true;
  }
});
</script>

<style lang="scss">
$time: 500ms;
*,
*:before,
*:after {
  box-sizing: border-box;
  font-family: sans-serif;
}
body {
  margin: 0;
  padding: 0;
}
#app {
  max-width: 100%;
}
.sidebar {
  width: 500px;
  margin: 0 auto;
  border: 2px solid #666;
  height: 100vh;
  padding: 1rem;
  overflow: hidden;

  &__content {
    position: relative;
    width: 100%;
    //overflow: hidden;
    height: 100%;
    //display: flex;
    //flex-direction: row;
    //align-items: flex-start;
  }

  .nav-level {
    flex: 1 0 100%;
    //transform: translateX(0);
  }
  .nav-link,
  .nav-items {
    flex: 1 0 100%;
    //transform: translateX(0);
  }
  .item-group {
    //flex: 1 0 100%;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .nav-item {
    padding: 0.5rem;
    background: #ddd;
  }
  .nav-item + .nav-item {
    margin-top: 0.5rem;
  }
}
.slide-left-enter-active {
  animation: slide-in-left $time;
}
.slide-left-leave-active {
  animation: slide-out-left $time;
}

.slide-right-enter-active {
  animation: slide-in-right $time;
}
.slide-right-leave-active {
  animation: slide-out-right $time;
}

@keyframes slide-in-left {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes slide-out-left {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes slide-in-right {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0%, 0, 0);
  }
}

@keyframes slide-out-right {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
