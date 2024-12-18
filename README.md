# 24 APPS SmartFlow

## About The Project

Our project focuses on providing a robust mobile application to track and manage key asset metrics effectively.

### Project Overview

Our team successfully developed a mobile application designed to help companies track and manage metrics of various assets. The primary goal of this project was to simplify asset management and increase awareness of usage patterns, which could lead to significant reductions in operational costs. Data-driven asset management techniques have the potential to deliver up to 15% annual savings.

### Key Features

- Interactive Monitoring: Track key asset metrics with ease.
- Data Visualization: Visualize data across time periods (weekly, monthly, yearly).
- Role-Based Access: Support for administrators and regular users.
- Charts and Graphs: Clear and interactive data presentations.

### Application Architecture

The application features a well-structured architecture divided into the following layers:

1. **Frontend**

- Intuitive and user-friendly UI/UX.
- Role-based access control for administrators and users.
- Interactive charts and tables for data visualization.

2. **Backend**

- RESTful API for efficient request handling.
- Scalability and robust architecture for backend operations.

3. **Database**

- MySQL for reliable data storage, retrieval, and management.

## Built With

This project was built using the following major frameworks, libraries, and tools:

- **React Native**
- **Expo**
- **Node.js**
- **Express.js**
- **MySQL**

## Getting Started

To set up the project locally and get it running, follow the steps below. These instructions will guide you through installing dependencies, configuring the environment, and running the application.

### Prerequisites

Ensure the following prerequisites are installed on your system:

1. **Node.js**:

- npm (comes with Node.js)
- Install Node.js and npm [here](https://nodejs.org/en/download/prebuilt-installer/current).

2. **Visual Studio Code**:

- Recommended for editing and managing the project.
- Download it from [here](https://code.visualstudio.com/download).

3. **Android Studio**:

- Required for running and testing the application on an Android emulator.
- Follow these steps to set it up:

#### Download and Install Android Studio: [here](https://developer.android.com/studio).

#### Set Up an Android Emulator:

1. Open **Android Studio**.
2. Go to **More Actions > Virtual Device Manager**.

   ![Virtual Device](https://github.com/user-attachments/assets/4f0dcedb-59f2-436c-9ee4-56f70e3f33fb)

3. **Create Virtual Device**.

   ![step1](https://github.com/user-attachments/assets/b3a59167-fcbc-4a46-8de3-b9c4c4bbe977)

4. Select a device model (e.g.,**Pixel 8**) and click **Next**.

   ![step2](https://github.com/user-attachments/assets/0f3fab6f-753b-4049-bac9-615d90897c58)

5. Download a recommended system image (e.g.,R) if not already installed and select a **System Image** and click **Next**.

   ![step3](https://github.com/user-attachments/assets/963a690a-e2f6-495c-b30b-18f3e645a020)

6. Verify configuration and **Finish** the setup.

   ![step4](https://github.com/user-attachments/assets/9d6ca0b8-29c1-40e2-aa40-e7602adbf2dd)

7. Start the emulator by clicking the **play icon**.

![step5](https://github.com/user-attachments/assets/9d2d4eb8-2f22-4c6c-b2b1-5e4a92503d55)

4. **MySQL Workbench**:

- Download it from [here](https://dev.mysql.com/downloads/workbench/).

### Installation

Follow these steps to install and configure the project locally:

- Clone the repository

```sh
git clone https://github.com/AndreiSusha/SmartFlow.git
```

- Navigate to the project directory

```sh
cd your_repo_name
```

1. **Database**:

## Database Setup

This project includes a database dump file to help you set up the `SmartFlow` database.

### Steps to Import the Database

1. Ensure you have MySQL installed and running on your machine.
2. Open MySQL Workbench or any other MySQL client.
3. Follow these steps to import the database:
   - Open MySQL Workbench and go to **Server > Data Import**.
   - Select **Import from Self-Contained File** and choose the file `database/SmartFlow.sql`.
   - Select or create a new schema (database) named `SmartFlow`.
   - Start the import process.

### Verifying the Database

1. After the import, run the following query in MySQL Workbench to ensure the data is loaded:

   ```sql
   USE SmartFlow;
   SHOW TABLES;

   ```

2. **Backend**:

- Navigate to the director:

```sh
cd Backend
```

- Create a **.env** file:

```sh
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=smartflow
PORT=3000
```

- Install NPM dependencies:

```sh
npm install
```

- Start the backend server:

```sh
npm start
```

3. Frontend

- Navigate to the directory:

```sh
cd frontend
```

- Create a **.env** file:
  Add the backend API URL:

```sh
EXPO_PUBLIC_API_BASE_URL="http://your_IP_Address:3000/"
```

- Install NPM dependencies:

```sh
npm install
```

- Start the frontend project:

```sh
npm start
```

### Run the mobile app using Expo:

- If you’re testing on a physical device, scan the QR code with the Expo Go app.
- If you're using an emulator, ensure it is running before starting the project.
- Press **a** in the terminal to run the project on the Android emulator.
