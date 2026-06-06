<?php
$message = "";

if(isset($_POST['register'])){

    $email    = $_POST['email'];
    $pass1    = $_POST['pass1'];
    $pass2    = $_POST['pass2'];
    $company  = $_POST['company'];
    $person   = $_POST['person'];

    if($pass1 !== $pass2){
        $message = "<div class='alert alert-danger'>Passwords do not match!</div>";
    } else {
        $message = "<div class='alert alert-success'>Registration Successful (Demo)</div>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Employer Registration</title>

<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="../bootstrap/dist/css/bootstrap.min.css">
<style>
/* Background */
/* ===== NAVBAR ===== */
.navbar {
    width: 100%;
    background: #111;
    padding: 15px 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.nav-container {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    color: #ffffff;
    font-size: 22px;
    font-weight: 600;
}

.nav-links a {
    color: #ffffff;
    text-decoration: none;
    margin-left: 20px;
    font-size: 16px;
    transition: 0.3s;
}

.nav-links a:hover {
    color: #00c853;
}

/* Add spacing so content doesn't go under navbar */
body {
    padding-top: 70px;
}
body {
    margin: 0;
    padding: 0;
    background: url('../images/employee.jpg') no-repeat center center fixed;
    background-size: cover;
    font-family: 'Segoe UI', sans-serif;
    color: #ffffff;
}

/* Dark Overlay */
.overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(4px);
    z-index: -1;
}

/* Glass Container - Reduced Width */
.glass-box {
    background: rgba(60, 53, 53, 0.55);
    padding: 40px;
    margin: 60px auto;
    width: 60%;              /* 🔥 Reduced width */
    border-radius: 15px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 25px rgba(20, 18, 18, 0.6);
}

/* Main Heading */
h1 {
    font-size: 48px;
    font-weight: 700;
    color: #ffffff;
    text-align: center;
}

/* Section Headings */
h3 {
    font-size: 28px;
    margin-top: 30px;
    color: #ffffff;
}

/* Paragraph */
p {
    font-size: 18px;
    text-align: center;
    color: #ffffff;
}

/* Labels */
label {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
}

/* Inputs */
.form-control {
    background: rgba(255,255,255,0.15) !important;
    border: none !important;
    color: #ffffff !important;
    font-size: 17px;
    padding: 10px;
}

.form-control::placeholder {
    color: #eeeeee;
}

/* Textarea */
textarea {
    resize: none;
}

/* Buttons */
.btn-success {
    background: #00c853;
    border: none;
    font-size: 18px;
    padding: 8px 20px;
}

.btn-danger {
    border: none;
    font-size: 18px;
    padding: 8px 20px;
}

.btn {
    margin-right: 10px;
}

/* Responsive */
@media (max-width: 768px) {
    .glass-box {
        width: 90%;
        padding: 25px;
    }
}
</style>
</head>
<body>

<div class="overlay"></div>

<div class="container glass-box">

    <h1 class="text-center">Register Your Company</h1>
    <p class="text-center">Post jobs and hire top talent easily.</p>

    <?php echo $message; ?>

    <form method="post">

        <h3>Login Details</h3>

        <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required class="form-control">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" name="pass1" required class="form-control">
        </div>

        <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" name="pass2" required class="form-control">
        </div>

        <h3>Company Details</h3>

        <div class="form-group">
            <label>Company Name</label>
            <input type="text" name="company" required class="form-control">
        </div>

        <div class="form-group">
            <label>Contact Person</label>
            <input type="text" name="person" required class="form-control">
        </div>

        <div class="form-group">
            <label>About Company</label>
            <textarea rows="4" required class="form-control"></textarea>
        </div>

        <button type="submit" name="register" class="btn btn-success btn-lg">Register</button>
        <button type="reset" class="btn btn-danger btn-lg">Reset</button>

    </form>

</div>

</body>
<!-- Navigation Bar -->
<nav class="navbar">
    <div class="nav-container">
        <div class="logo">JOB NOVA</div>
        <div class="nav-links">
            <a href="../index.php">Home</a>
            <a href="../login.php">Login</a>
        </div>
    </div>
</nav>
</html>