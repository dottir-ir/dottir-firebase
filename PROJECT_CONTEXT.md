# MedCase Platform: Project Context

## 1. Platform Overview

MedCase Platform is a specialized online community designed to facilitate knowledge sharing and discussion among medical professionals and students, with a particular focus on radiography. The platform bridges the gap between theoretical medical education and practical clinical experience by providing a structured environment for case-based learning. It serves as both an educational resource for students and a professional networking tool for doctors, fostering a community of practice around medical imaging and diagnosis.

## 2. User Roles and Permissions

### 2.1 Doctor Role
- Content creators and medical experts
- Must undergo verification process
- Can create and upload medical cases
- Can edit/delete their own cases
- Can interact with all content (like, comment, save)
- Profile displays professional info and published cases

### 2.2 Medical Student Role
- Primary learners on the platform
- Immediate access after registration
- Can browse all published cases
- Can interact with content (like, comment, save)
- Cannot create new cases
- Profile displays academic info and saved cases

### 2.3 Admin Role
- Platform administrators
- Manage user verification
- Moderate content
- Handle platform maintenance
- Access to admin panel
- Can manage all user accounts and content

## 3. Core Features

### 3.1 Newsfeed
- Chronological display of published cases
- Filtering by tags, date, popularity
- Search functionality
- Infinite scroll loading
- Case previews with thumbnails

### 3.2 Case Management
- Structured case upload process
- Support for multiple images
- Patient demographics (age, gender)
- Clinical presentation
- Imaging findings
- Differential diagnosis
- Final diagnosis
- Teaching points
- Tags and categories

### 3.3 Social Features
- Like system for case appreciation
- Comment system for discussions
- Save/bookmark functionality
- User profiles
- Activity tracking

## 4. Data Models

### 4.1 User Model
```typescript
interface User {
  id: string;                 // Unique identifier
  email: string;              // Email address
  displayName: string;        // Display name
  photoURL?: string;          // Profile picture URL
  role: 'doctor' | 'student' | 'admin';  // User role
  bio?: string;               // Biography
  title?: string;             // Professional title
  createdAt: Date;            // Account creation date
  updatedAt: Date;            // Last update date
  
  // Doctor-specific fields
  specialty?: string;         // Medical specialty
  hospital?: string;          // Hospital affiliation
  isVerified?: boolean;       // Verification status
  verificationDocuments?: string[];  // Credentials
  
  // Student-specific fields
  medicalSchool?: string;     // Medical school
  yearOfStudy?: number;       // Year of study
  areasOfInterest?: string[]; // Areas of interest
}
```

### 4.2 Case Model
```typescript
interface Case {
  id: string;                 // Unique identifier
  authorId: string;           // Author reference
  title: string;              // Case title
  patientAge: number;         // Patient age
  patientGender: 'male' | 'female' | 'other';  // Patient gender
  clinicalPresentation: string;  // Clinical history
  images: CaseImage[];        // Case images
  imagingFindings: string;    // Radiographic findings
  differentialDiagnosis: string;  // Possible diagnoses
  finalDiagnosis: string;     // Confirmed diagnosis
  teachingPoints: string;     // Educational discussion
  tags: string[];             // Case categories
  createdAt: Date;            // Creation date
  updatedAt: Date;            // Last update date
  isPublished: boolean;       // Publication status
  viewCount: number;          // View count
  likeCount: number;          // Like count
  commentCount: number;       // Comment count
  saveCount: number;          // Save count
}
```

### 4.3 Comment Model
```typescript
interface Comment {
  id: string;                 // Unique identifier
  caseId: string;             // Case reference
  authorId: string;           // Author reference
  text: string;               // Comment content
  createdAt: Date;            // Creation date
  updatedAt?: Date;           // Last update date
  isEdited: boolean;          // Edit status
  parentId?: string;          // Parent comment (for replies)
}
```

### 4.4 Like Model
```typescript
interface Like {
  id: string;                 // Unique identifier
  userId: string;             // User reference
  caseId: string;             // Case reference
  createdAt: Date;            // Creation date
}
```

### 4.5 Save Model
```typescript
interface Save {
  id: string;                 // Unique identifier
  userId: string;             // User reference
  caseId: string;             // Case reference
  createdAt: Date;            // Creation date
  collectionId?: string;      // Collection reference
}
```

### 4.6 VerificationRequest Model
```typescript
interface VerificationRequest {
  id: string;                 // Unique identifier
  userId: string;             // User reference
  documents: string[];        // Credential documents
  status: 'pending' | 'approved' | 'rejected';  // Request status
  submittedAt: Date;          // Submission date
  reviewedAt?: Date;          // Review date
  reviewerId?: string;        // Reviewer reference
  rejectionReason?: string;   // Rejection reason
}
```

## 5. Authentication Flow

### 5.1 Registration Process
- **Medical Students**:
  1. Complete registration form (email, password, name, medical school, year)
  2. Firebase Authentication creates account
  3. User document created with 'student' role
  4. Immediate platform access granted

- **Doctors**:
  1. Complete registration form (email, password, name, specialty, hospital)
  2. Firebase Authentication creates account
  3. User document created with 'doctor' role (unverified)
  4. Verification request created
  5. Upload verification documents
  6. Limited access until verified

### 5.2 Login Process
1. User enters credentials
2. Firebase Authentication verifies
3. Authentication state updated
4. Custom claims (role) loaded
5. Redirect to appropriate page

### 5.3 Session Management
- JWT tokens for authentication
- Automatic token refresh
- Secure token storage
- Role-based access control

## 6. Security Considerations

### 6.1 Authentication Security
- Email verification required
- Password strength requirements
- Rate limiting on login attempts
- Secure session management
- Optional 2FA

### 6.2 Data Security
- Firebase Security Rules
- Role-based access control
- Data validation at multiple levels
- Input sanitization
- Secure file storage

### 6.3 Content Security
- Image metadata removal
- Content moderation tools
- Rate limiting on content creation
- Admin review process
- User reporting system 