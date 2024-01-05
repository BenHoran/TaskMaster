import React, { Fragment } from "react";
import Link from 'next/link'

const Sidebar = ({ children }) => {
  return (
    <Fragment>
      <div></div>
      <aside className={styles.sidebar}>
        <div className={styles.menu}>
          <ul className={styles.menulist}>
            <li>
              <Link className={styles.menulink} href="/app">
                <span className={styles.menuname}>Main</span>
              </Link>
            </li>
            <li>
              <Link className={styles.menulink} href="/app/tasks">
                <span className={styles.menuname}>Tasks</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </Fragment>
  );
};

const styles = {
  sidebar:
    "z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0",
  menu: "h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800",
  menulist: "space-y-2 font-medium",
  menulink:
    "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
  menuname: "flex-1 ms-3 whitespace-nowrap",
};

export default Sidebar;
