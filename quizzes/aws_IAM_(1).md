# aws IAM (1)

**1. What is the primary topic covered in Module 4 of the AWS Academy Cloud Foundations course?**

- A) AWS Cloud Security
- B) AWS Billing and Support
- C) AWS Cloud Economics
- D) AWS Architecture Basics

**2. According to the AWS shared responsibility model, which security responsibility belongs directly to AWS?**

- A) Guest operating system patching
- B) Physical security of data centers
- C) IAM permission configurations
- D) Customer data encryption

**3. Under the AWS shared responsibility model, which task is considered a responsibility of the customer?**

- A) Hardware maintenance
- B) Storage host OS access logging
- C) Security group configuration
- D) Virtualization infrastructure management

**4. Which cloud computing model offers the customer maximum flexibility over configuring networking and storage, but places more security management duties on the customer?**

- A) Software as a Service (SaaS)
- B) Platform as a Service (PaaS)
- C) Infrastructure as a Service (IaaS)
- D) Database as a Service (DBaaS)

**5. Which service is categorized as Platform as a Service (PaaS), where AWS manages the underlying operating system and database patching?**

- A) Amazon EC2
- B) Amazon Relational Database Service (Amazon RDS)
- C) Amazon Elastic Block Store (Amazon EBS)
- D) Amazon Virtual Private Cloud (Amazon VPC)

**6. Which service is cited as an example of Software as a Service (SaaS) within AWS?**

- A) Amazon EC2
- B) AWS Trusted Advisor
- C) Amazon VPC
- D) Amazon EBS

**7. Who is responsible for upgrades and security patches to an operating system installed on an Amazon EC2 instance?**

- A) AWS
- B) The customer
- C) Both AWS and the customer equally
- D) Third-party OS vendors

**8. Who is responsible for performing Oracle database upgrades or patches when Oracle is running as an Amazon RDS instance?**

- A) The customer
- B) AWS
- C) Oracle Corporation exclusively
- D) The hardware vendor

**9. Who is responsible for configuring access permissions on an Amazon S3 bucket?**

- A) AWS
- B) The customer
- C) The third-party network provider
- D) AWS Identity and Access Management automatically

**10. Who is responsible for protecting against network outages across AWS Regions?**

- A) The customer
- B) AWS
- C) Internet service providers
- D) The network administrator

**11. Who is responsible for securing SSH keys used to access EC2 instances?**

- A) AWS
- B) The customer
- C) The key generation authority
- D) AWS IAM automatically

**12. Who is responsible for enforcing multi-factor authentication (MFA) for user logins within an AWS account?**

- A) AWS
- B) The customer
- C) The identity provider vendor
- D) The web server host

**13. What is the primary role of AWS Identity and Access Management (IAM)?**

- A) To monitor billing and costs
- B) To manage access to AWS resources
- C) To deploy automated server updates
- D) To optimize physical data center cooling

**14. How much does the IAM feature cost to use within an AWS account?**

- A) It is charged per user created
- B) It is billed based on API request count
- C) It is a no-cost feature
- D) It is included only with enterprise support plans

**15. Which IAM entity is defined as a person or application that authenticates with an AWS account?**

- A) IAM group
- B) IAM user
- C) IAM policy
- D) IAM role

**16. Which IAM component is defined as a collection of IAM users granted identical authorization?**

- A) IAM role
- B) IAM group
- C) IAM policy
- D) IAM bucket

**17. What type of document defines which resources can be accessed and the level of access permitted?**

- A) IAM policy
- B) IAM role
- C) IAM user
- D) IAM credential

**18. Which IAM mechanism provides a set of permissions for making temporary AWS service requests?**

- A) IAM group
- B) IAM user
- C) IAM role
- D) IAM root credentials

**19. What credentials are used for programmatic access to AWS via the AWS CLI or AWS SDKs?**

- A) Account ID and alias
- B) Username and password
- C) Access key ID and secret access key
- D) MFA token code only

**20. What credentials are required to authenticate an IAM user via the AWS Management Console?**

- A) Access key ID and secret access key
- B) 12-digit Account ID (or alias), username, and password
- C) SSH public key and private key
- D) AWS KMS key pair

**21. What security practice requires a user to enter a unique authentication code from a token or device in addition to their password?**

- A) Multi-factor authentication (MFA)
- B) Single sign-on (SSO)
- C) Public key cryptography
- D) Role assumption

**22. By default, what is the initial permission state in IAM for any newly created identity?**

- A) All permissions are allowed
- B) Read-only permissions are allowed
- C) All permissions are implicitly denied
- D) Full administrator access is granted

**23. What happens in IAM when a request contains both an explicit allow and an explicit deny statement for the same action?**

- A) The allow statement takes precedence
- B) The explicit deny statement takes precedence
- C) The request defaults to read-only access
- D) The system prompts the user to resolve the conflict

**24. What recommended security practice advocates giving users only the permissions necessary to perform their specific job functions?**

- A) Principle of full access
- B) Principle of least privilege
- C) Principle of open authorization
- D) Principle of defense-in-depth

**25. What is the geographic scope of IAM service configurations?**

- A) Regional
- B) Global
- C) Availability Zone-specific
- D) VPC-bound

**26. In what standard format are IAM policies written?**

- A) XML
- B) JSON
- C) YAML
- D) HTML

**27. Which statement best describes identity-based policies?**

- A) Policies attached directly to resources like S3 buckets
- B) Policies attached to an IAM user, group, or role
- C) Policies defined inline exclusively on VPC subnets
- D) Policies that grant global administrator access automatically

**28. Where are resource-based policies attached?**

- A) To an IAM user
- B) To an IAM group
- C) To a resource (such as an S3 bucket)
- D) To an IAM role

**29. Are IAM groups allowed to contain nested groups?**

- A) Yes, up to 3 levels deep
- B) Yes, without limit
- C) No, groups cannot be nested
- D) Yes, if configured via the AWS CLI

**30. How should an application running on an Amazon EC2 instance safely obtain permission to access an Amazon S3 bucket?**

- A) Embed hardcoded access keys in the application code
- B) Store root credentials on the EC2 instance filesystem
- C) Attach an IAM policy to a role and allow the EC2 instance to assume the role
- D) Provide the EC2 instance with the administrator password

