<template>
  <div id="app">
    <div class="sidebar">
      <h2>Sidebar</h2>
      <hr />
      <div class="sidebar__container">
        <div class="nav-item" v-if="currentBackId" @click="prev(currentBackId)">
          &lt; Back to {{ currentBackId }}
        </div>
        <hr />

        <template v-if="allDone">
          <transition-group
            :name="'slide-right'"
            mode="in-out"
            tag="div"
            class="sidebar__content"
          >
            <div class="item-group" v-if="currentList" :key="currentList[0].id">
              <template v-for="item in currentList">
                <div
                  class="nav-item"
                  v-if="item.hasChildren"
                  @click="
                    slide({ animation: 'slide-right', currentItem: item })
                  "
                  :key="item.id"
                >
                  {{ item.title }} &gt;&gt;
                </div>
                <div class="nav-item" v-else :key="item.id">
                  {{ item.title }}
                </div>
              </template>
            </div>
          </transition-group>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

interface Nav {
  id: string;
  title: string;
  children?: Nav[];
}

interface NavItem {
  id: string;
  title: string;
  parent: string;
}

interface SimpleNavItem extends NavItem {
  hasChildren: boolean;
}

interface SimpleNav extends NavItem {
  children: SimpleNavItem[];
}

interface FullNavItem extends NavItem {
  children?: FullNavItem[];
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
  data() {
    return {
      slideAnimation: "slide-left",
      allDone: false,
      menu,
      currentList: [] as SimpleNavItem[],
      fullList: [] as FullNavItem[],
      currentBackId: null as string | null,
      lastClickedItem: {} as SimpleNavItem
    };
  },
  methods: {
    slide(config: { animation: string; currentItem: SimpleNavItem }) {
      this.lastClickedItem = config.currentItem;
      const navItem = this.findNavItemById(config.currentItem.id, this.menu);
      if (navItem && navItem.children) {
        this.currentList = this.getCurrentList(navItem.children, navItem.id);
        this.currentBackId = config.currentItem.parent;
      }
    },
    next(item: string): void {
      this.slideAnimation = "slide-right";
    },
    prev(item: string): void {
      const navItem = this.findNavItemById(item, this.menu);
      if (navItem && navItem.children) {
        this.currentList = this.getCurrentList(navItem.children, navItem.id);
      } else {
        this.currentList = this.getCurrentList(this.menu, "main");
      }
      if (this.lastClickedItem && this.lastClickedItem.parent) {
        this.currentBackId = this.lastClickedItem.parent;
      }

      this.currentBackId = this.findParent(this.fullList, item);
    },

    createFullNavList(nav: Nav[], parent: string): FullNavItem[] {
      const result: FullNavItem[] = [];
      for (const navItem of nav) {
        const item: FullNavItem = {
          id: navItem.id,
          title: navItem.title,
          parent
        };
        if (navItem.children && navItem.children.length > 0) {
          item.children = this.createFullNavList(navItem.children, navItem.id);
        }
        result.push(item);
      }
      return result;
    },
    findNavItemById(id: string, nav: Nav[]): Nav | null {
      let result: Nav | null = null;
      for (const item of nav) {
        if (item.id === id) {
          result = item;
          break;
        } else {
          if (item.children && item.children.length > 0) {
            result = this.findNavItemById(id, item.children as Nav[]);
            if (result) {
              break;
            }
          }
        }
      }
      return result;
    },
    getCurrentList(nav: Nav[], parent: string): SimpleNavItem[] {
      const result: SimpleNavItem[] = [];
      let hasChildren = false;
      for (const navItem of nav) {
        if (navItem.children && navItem.children.length > 0) {
          hasChildren = true;
        }
        result.push({
          id: navItem.id,
          title: navItem.title,
          hasChildren,
          parent
        });
      }
      return result;
    },
    findParent(nav: FullNavItem[], id: string): string | null {
      console.log("id", id);
      let parent: string | null = null;
      for (const item of nav) {
        console.log("item: ", item);
        if (item.id === id) {
          console.log("item parent ", item.parent);
          if (parent === null) {
            parent = "main";
          }
          break;
        } else {
          if (item.children && item.children.length > 0) {
            parent = this.findParent(item.children, id);
          }
        }
      }
      return parent;
    }
  },
  mounted() {
    this.fullList = this.createFullNavList(this.menu, "main");
    this.currentList = this.getCurrentList(this.menu, "main");
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
