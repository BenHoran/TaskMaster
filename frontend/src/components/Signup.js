import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.title}>Monthly Membership</div>
                <div className={styles.body}>
                    <ul>
                        <li>Benifit 1</li>
                        <li>Benifit 2</li>
                        <li>Benifit 3</li>
                    </ul>
                    <span>$10/month</span>
                </div>
                <Link className={styles.link}>Join</Link>
            </div>
            <div className={styles.card}>
                <div className={styles.title}>Yearly Membership</div>
                <div className={styles.body}>
                    <ul>
                        <li>Benifit 1</li>
                        <li>Benifit 2</li>
                        <li>Benifit 3</li>
                    </ul>
                    <span>$100/month</span>
                </div>
                <Link className={styles.link}>Join</Link>
            </div>
        </div>
    )
}

const styles = {
  container: "container flex mx-auto p-4 bg-stone-100",
  card: "bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700",
  title: "text-center text-xl mb-5",
  link: "float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800",
  body: ""
}

export default SignUp;