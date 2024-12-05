## **Step 1: Project Setup**

**1.1 Initialize the Git Repository**

- **Action**: Initialize a new Git repository to track your project changes.
- **Verification**: Run `git status` to ensure the repository is initialized.

**1.2 Install Dependencies**

- **Action**: Install all necessary packages.
  ```bash
  npm install
  ```
- **Verification**: Ensure `node_modules` folder is populated and `package-lock.json` is updated.

**1.3 Configure Tailwind CSS**

- **Action**: Ensure Tailwind CSS is properly configured in `tailwind.config.ts` and imported in `globals.css`.
- **Verification**: Run the development server and check if Tailwind styles are applied.

---

## **Step 2: Implement the Input Interface**

### **2.1 Create Input Form Component**

- **Action**: In `src/components/input-interface/`, create `input-form.tsx`.
  - Use Shadcn UI components for form elements.
  - Import necessary data from `src/lib/data/`.
- **Verification**: Import `InputForm` into `src/app/page.tsx` and render it.
  - **Test**: Open the app in a browser and verify the form displays correctly with all input fields.

### **2.2 Implement Input Validation**

- **Action**: In `input-form.tsx`, add form validation using helper functions from `helpers.ts`.
- **Verification**: Attempt to submit the form with invalid data.
  - **Test**: Ensure validation messages appear and prevent submission.

### **2.3 Define TypeScript Interfaces for Input Data**

- **Action**: In `types.ts`, define interfaces for each input field.
- **Verification**: Check for TypeScript errors in `input-form.tsx`.
  - **Test**: Ensure the component adheres to the defined interfaces.

---

## **Step 3: Set Up State Management**

### **3.1 Configure Redux Store**

- **Action**: In `src/store/`, create `store.ts` and configure the Redux store.
- **Verification**: Ensure the store is set up without errors.
  - **Test**: Dispatch a test action and check if it reaches the reducer.

### **3.2 Create Simulation Slice**

- **Action**: In `simulation-slice.ts`, define the initial state and reducers for handling simulation data.
- **Verification**: Use Redux DevTools to monitor state changes.
  - **Test**: Update the state and verify changes in DevTools.

### **3.3 Connect Input Form to Redux Store**

- **Action**: Use `useDispatch` and `useSelector` in `input-form.tsx` to dispatch actions and select state.
- **Verification**: Submit the form and check if the state updates correctly.
  - **Test**: Inspect the state in Redux DevTools after form submission.

---

## **Step 4: Implement Backend API Route**

### **4.1 Create API Route**

- **Action**: In `src/app/api/simulate/route.ts`, create an API route to handle POST requests.
- **Verification**: Access the API route via a browser or tool like Postman.
  - **Test**: Send a GET request and ensure it returns a 404 or appropriate message.

### **4.2 Receive Data from Frontend**

- **Action**: Modify the API route to accept POST requests with JSON body.
- **Verification**: From `input-form.tsx`, send a POST request upon form submission.
  - **Test**: Console log the received data in `route.ts` and check the server logs.

### **4.3 Add CORS Support (if necessary)**

- **Action**: Configure the API route to handle CORS if accessing from different origins.
- **Verification**: Ensure no CORS errors appear in the browser console.

---

## **Step 5: Integrate OpenAI API**

### **5.1 Install OpenAI SDK**

- **Action**: Install OpenAI SDK.
  ```bash
  npm install openai
  ```
- **Verification**: Check `package.json` to ensure the package is listed.

### **5.2 Set Up Environment Variables**

- **Action**: Create a `.env.local` file and add `OPENAI_API_KEY`.
- **Verification**: Access the environment variable in `route.ts` without errors.

### **5.3 Implement Simulation Logic**

- **Action**: In `route.ts`, implement the logic to call the OpenAI API with the input data.
- **Verification**: Mock the API call initially by returning a sample response.
  - **Test**: Ensure the API route returns the mocked response to the frontend.

### **5.4 Handle API Responses**

- **Action**: Parse the OpenAI API response and structure it for the frontend.
- **Verification**: Console log the structured response.
  - **Test**: Ensure the data matches the expected format defined in `types.ts`.

---

## **Step 6: Display Simulation Results on Frontend**

### **6.1 Create Output Display Component**

- **Action**: In `src/components/output-display/`, create `output-display.tsx`.
- **Verification**: Render `OutputDisplay` in `results/page.tsx`.
  - **Test**: Ensure the component renders without errors.

### **6.2 Define TypeScript Interfaces for Output Data**

- **Action**: In `types.ts`, define interfaces for the simulation results.
- **Verification**: Check for TypeScript compliance in `output-display.tsx`.

### **6.3 Fetch Data from Backend**

- **Action**: In `results/page.tsx`, fetch the simulation results from the API.
- **Verification**: Use `getServerSideProps` or server components to fetch data.
  - **Test**: Ensure the data is fetched and passed to `OutputDisplay`.

### **6.4 Display Simulation Results**

- **Action**: In `output-display.tsx`, map over the results and display them.
- **Verification**: Check the browser to see if results are displayed correctly.

---

## **Step 7: Implement Year-by-Year Progression**

### **7.1 Modify Backend to Stream Results**

- **Action**: Implement server-sent events (SSE) or websockets in `route.ts` to stream year-by-year data.
- **Verification**: Console log each year's data as it's sent.

### **7.2 Update Frontend to Receive Stream**

- **Action**: In `output-display.tsx`, set up an event listener to receive data chunks.
- **Verification**: Ensure data is received incrementally.
  - **Test**: Display each year's data as it's received.

---

## **Step 8: Implement Data Visualization**

### **8.1 Install Visualization Library**

- **Action**: Install Tremor or Recharts.
  ```bash
  npm install recharts
  ```
- **Verification**: Check `package.json` for the new dependency.

### **8.2 Create KPI Chart Component**

- **Action**: In `kpi-chart.tsx`, create a component to visualize KPIs.
- **Verification**: Import `KPIChart` into `output-display.tsx` and pass the necessary data.
  - **Test**: Ensure charts render correctly with sample data.

### **8.3 Test with Real Data**

- **Action**: Feed actual simulation results into the chart.
- **Verification**: Verify that the charts update dynamically with the data.

---

## **Step 9: Implement Local Storage for Simulation Runs**

### **9.1 Create Local Storage Utilities**

- **Action**: In `utils.ts`, write functions to save and retrieve simulations from local storage.
- **Verification**: Use the browser console to check if data is stored.

### **9.2 Update Redux Store to Include Saved Simulations**

- **Action**: Modify `simulation-slice.ts` to handle saved simulations.
- **Verification**: Dispatch actions to save and load simulations.
  - **Test**: Ensure the state reflects the saved simulations.

### **9.3 Create Component to List Past Simulations**

- **Action**: In `src/components/output-display/`, create `simulation-list.tsx`.
- **Verification**: Render the list in `results/page.tsx`.
  - **Test**: Click on a past simulation and load its data.

---

## **Step 10: Implement Comparative Analysis Features**

### **10.1 Design Comparison Interface**

- **Action**: Create `comparison-interface.tsx` in `src/components/output-display/`.
- **Verification**: Ensure the interface allows selection of multiple simulations.

### **10.2 Implement Comparison Logic**

- **Action**: Write functions to compare KPIs and other metrics.
- **Verification**: Console log comparison results to verify correctness.

### **10.3 Display Comparative Charts**

- **Action**: Use visualization components to display comparisons.
- **Verification**: Ensure charts accurately reflect the differences.

---

## **Step 11: Optimize Performance**

### **11.1 Minimize 'use client'**

- **Action**: Review components and remove unnecessary `'use client'` directives.
- **Verification**: Ensure components still function as expected.

### **11.2 Implement Code Splitting**

- **Action**: Use dynamic imports for non-critical components.
  - Example:
    ```tsx
    const KPIChart = dynamic(() => import('./kpi-chart'), { ssr: false });
    ```
- **Verification**: Check that the component loads asynchronously.

### **11.3 Optimize Images**

- **Action**: Convert images to WebP format and specify dimensions.
- **Verification**: Use browser dev tools to ensure images are optimized.

### **11.4 Analyze Web Vitals**

- **Action**: Use Lighthouse or Web Vitals extension to measure performance.
- **Verification**: Ensure LCP, CLS, and FID scores are within acceptable ranges.

---

## **Step 12: Final Testing and Quality Assurance**

### **12.1 Cross-Browser Testing**

- **Action**: Test the application in multiple browsers (Chrome, Firefox, Safari).
- **Verification**: Ensure consistent behavior across browsers.

### **12.2 Responsive Design Testing**

- **Action**: Test the application on different screen sizes.
- **Verification**: Use browser dev tools to simulate mobile devices.

### **12.3 Accessibility Testing**

- **Action**: Use tools like Axe or Lighthouse to check for accessibility issues.
- **Verification**: Address any identified issues to improve accessibility.

### **12.4 Error Handling and Edge Cases**

- **Action**: Test how the app handles API failures or invalid inputs.
- **Verification**: Ensure graceful error messages are displayed.

### **12.5 Security Testing**

- **Action**: Review code for potential security vulnerabilities.
- **Verification**: Ensure sensitive data (like API keys) is not exposed.

---

## **Step 13: Deployment**

### **13.1 Prepare for Deployment**

- **Action**: Optimize build settings and environment variables for production.
- **Verification**: Run `npm run build` and fix any build errors.

### **13.2 Deploy to Hosting Platform**

- **Action**: Deploy the application to Vercel