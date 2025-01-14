# Node-Tidy

**Node-Tidy** is a CLI tool designed to identify and remove unused dependencies and Missing Dependencies required in your Node.js projects. It simplifies package management and ensures your `node_modules` directory and `package.json` stay clean and efficient run your `code` on Production Error Free 😊

---

## 🚀 Features

- Detects unused `dependencies` and `devDependencies` in your project.
- Provides an interactive option to remove unused packages.
- Keeps your project lightweight and efficient.
- Rollback option to restore changes if needed.
- Find `Missing Dependencies` and Install them

---

## 📦 Installation

Install Node-Tidy globally via NPM:

```bash
npm install -g node-tidy
```

## 🛠️ Usage

- Navigate to your Node.js project directory:

```bash
cd your-project
```

- Run

```bash
node-tidy
```

---

```
❯ node-tidy
Checking for unused packages. This may take a while...
Unused packages found:
Dependencies:
- mongoose
Do you want to remove these unused packages? (yes/no): y
Removing mongoose...
Unused packages removed successfully.
Do you want to rollback the changes? (yes/no): n
Changes retained.
Scanning for missing packages...

Missing packages detected:
- express
- dotenv
- morgan

Do you want to install these missing packages? (yes/no): y
Installing express...
Installing dotenv...
Installing morgan...
Missing packages installed successfully.

```

---

## 😊 Why Use Node-Tidy?

- **Save Disk Space**: By removing unnecessary packages, you free up space in your project and on your disk, ensuring you're only keeping what's necessary.
- **Improve Performance**: A leaner `node_modules` and cleaner `package.json` means faster install times and more efficient project load times.
- **Cleaner Project Structure**: Node-Tidy helps keep your project organized by removing unused dependencies, ensuring your `package.json` is only reflecting what’s in use.
- **Easier Dependency Management**: Keeping your dependencies up-to-date and removing unused ones reduces the complexity of managing package versions and conflicts.
- **Quick and Interactive**: Node-Tidy offers an easy-to-use interactive prompt, making the process of identifying and removing unused dependencies simple and painless.
- **Rollback Changes**: Made a mistake? No worries. Node-Tidy lets you rollback the removal process, restoring your project to its previous state.
  -- **Find Missing Dependencies and Install Them** : Missing dependencies but don't which and getting error but don't worry Node-Tidy got you covered.It will find all dependencies and install them so that you don't have to worry about them and run Project error free
