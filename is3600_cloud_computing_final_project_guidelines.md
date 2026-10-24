![INDIANA TECH](https://via.placeholder.com/150x30?text=INDIANATECH)

# IS 3600 Cloud Computing Final Project

**PROJECT NAME:** Campus Event Hub

Your team has been hired as Junior Cloud Architects for a university. The goal is to design, deploy, and monitor a cloud Campus Event Registration Portal that can scale reliably, securely host static assets, store user registrations in a database, and provide basic operational monitoring.

This project focuses on core architectural pillars—Compute, Storage, Networking, Database, and Monitoring.

* **Team Size:** 2–4 team members
* **ENVIRONMENT:** AWS Academy Learners Lab (the Learner Lab preserves your work between sessions). Please accept the AWS Academy lab invitation from your email. Be aware of the $100 credit cap.

---

## Task Breakdowns (60%)

### 1. Networking & Security (VPC & IAM) (15%)
**Objective:** Establish a secure, isolated cloud network.

**Tasks:**
* Create a custom VPC with a clear CIDR block.
* Set up both **Public Subnets** (for web/application tiers) and **Private Subnets** (for database tiers).
* Configure an **Internet Gateway (IGW)** and a **Route Table** to allow public internet traffic into the public subnets.
* Create custom **Security Groups** acting as virtual firewalls:
  * One for **Web Servers** allowing inbound HTTP (80) and SSH/Session Manager (22).
  * One for **Databases** allowing inbound traffic *only* from the Web Server Security Group on port 3306 (MySQL) or 5432 (PostgreSQL).

### 2. Compute & Frontend (EC2 & S3) (15%)
**Objective:** Deploy the compute layers and storage components.

**Tasks:**
* **S3 Static Hosting:** Create an Amazon S3 bucket to host the frontend HTML/CSS/JS landing page for the event. Enable static website hosting and configure bucket policies safely.
* **EC2 Web Server:** Launch an Amazon EC2 Linux instance inside the public subnet created by the networking lead.
* Write a basic user data script (`user-data`) or log in via EC2 Instance Connect to install a web server (like Apache or Nginx) that pulls content or serves a dynamic page.

### 3. Database & Backend Integration (RDS) (15%)
**Objective:** Set up managed data storage for student event sign-ups.

**Tasks:**
* Deploy a managed **Amazon RDS** instance (MySQL or PostgreSQL) inside the **Private Subnets** (ensuring it is not exposed directly to the public internet).
* Configure a **DB Subnet Group** and associate it with the database.
* Test connectivity by logging into the EC2 web server and verifying it can successfully communicate with the RDS endpoint.

### 4. Monitoring, Logging & Cost Optimization (CloudWatch & Billing) (15%)
**Objective:** Implement operational visibility and resource tracking.

**Tasks:**
* Set up **Amazon CloudWatch Alarms** for the EC2 instance (e.g., trigger an alarm if CPU utilization goes above 80%).
* Create a custom **CloudWatch dashboard** to monitor EC2 CPU usage and network input/output.
* Review the sandbox billing/usage console to track the estimated cost of running the architecture.
* **Cleanup Architect:** Lead the team in terminating/stopping resources cleanly at the end of the project to respect sandbox constraints.

---

## Deliverables & Evaluation

* **Project Design Report (20%):** APA style report including summary, design, implementation details, and references.
* **Presentation (20%):**
  * PowerPoint slide deck (10%)
  * In-person presentation: Live site demo and AWS component walkthrough (10%)

---

## Notes: How Work Persistence Works in Learner Lab

### Configurations & Saved Data Persist:
* Your VPCs, Subnets, Security Groups, S3 Buckets, RDS Instances, and EBS Volumes remain intact in your account throughout the course term.
* When your 4-hour session expires or you click "End Lab," your running EC2 instances are automatically put into a stopped state.

### Resuming Your Work Next Session:
* When you log back in and click "Start Lab," your saved infrastructure will still be there.
* Simply go to the EC2 console, select your web server instance, click **Instance state -> Start instance**, and resume right where you left off.

### When Work WILL Be Cleared:
* **The "Reset" Button:** If you manually click the red "Reset" button in the Learner Lab controls, it will completely wipe all resources in the account.
* **Exhausting the $100 Budget:** If your total spending across sessions reaches $100, the account will be deactivated, and access to resources will be revoked.