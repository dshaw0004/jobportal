<?php
/**
 * Online-Job-Portal - A web application built on PHP HTML & javascript
 * Employer Registration Form
 */
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Employer Registration - JOB NOVA</title>

<link rel="stylesheet" href="../bootstrap/dist/css/bootstrap.min.css">

<style>
body {
    background: url('../images/employee.jpg') no-repeat center center fixed;
    background-size: cover;
    font-family: 'Segoe UI', sans-serif;
    color: #ffffff;
    padding-top: 80px;
}

body::before {
    content: "";
    position: fixed;
    top: 0; left: 0;
    height: 100%; width: 100%;
    background: rgba(6, 20, 40, 0.55);
    z-index: -1;
}

/* ===== NAVBAR ===== */
.navbar-custom {
    width: 100%;
    background: #111;
    padding: 15px 0;
    position: fixed;
    top: 0; left: 0;
    z-index: 1000;
}
.nav-container {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo { color: #fff; font-size: 22px; font-weight: 600; }
.nav-links a {
    color: #fff;
    text-decoration: none;
    margin-left: 20px;
    font-size: 16px;
    transition: 0.3s;
}
.nav-links a:hover { color: #00c853; }

/* ===== FORM CARD ===== */
.glass-box {
    background: rgba(20, 30, 50, 0.65);
    padding: 40px;
    margin: 20px auto 60px;
    max-width: 780px;
    border-radius: 15px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.15);
}

h1 { font-size: 36px; font-weight: 700; text-align: center; color: #fff; }
h4 { font-size: 20px; color: #00c853; margin-top: 25px; margin-bottom: 15px; }
p  { font-size: 16px; text-align: center; color: #ccc; }

label { font-size: 15px; font-weight: 600; color: #ddd; }

.form-control {
    background: rgba(255,255,255,0.12) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    color: #fff !important;
    font-size: 15px;
}
.form-control::placeholder { color: #aaa; }
.form-control option { color: #000; background: #fff; }

select.form-control { color: #fff !important; }

textarea { resize: vertical; }

.btn-success { background: #00c853; border: none; font-size: 16px; padding: 10px 28px; }
.btn-success:hover { background: #00a843; }
.btn-danger  { border: none; font-size: 16px; padding: 10px 28px; }

.section-divider {
    border-top: 1px solid rgba(255,255,255,0.15);
    margin: 20px 0;
}

@media (max-width: 768px) {
    .glass-box { padding: 25px; }
}
</style>

<script>
function checkForm() {
    var p1 = document.getElementById("pass1").value;
    var p2 = document.getElementById("pass2").value;
    if (p1 !== p2) {
        alert("Passwords do not match!");
        return false;
    }
    return true;
}
</script>
</head>
<body>

<!-- Navigation Bar -->
<nav class="navbar-custom">
    <div class="nav-container">
        <div class="logo">JOB NOVA</div>
        <div class="nav-links">
            <a href="../index.php">Home</a>
            <a href="../login.php">Login</a>
        </div>
    </div>
</nav>

<div class="container">
<div class="glass-box">

    <h1>Register Your Company</h1>
    <p>Post jobs and hire top talent easily.</p>

    <form id="regemp" method="post" action="process_regemp.php" onsubmit="return checkForm()">

        <!-- ===== LOGIN DETAILS ===== -->
        <h4>Login Details</h4>

        <div class="form-group">
            <label>Email Address</label>
            <input type="email" name="email" class="form-control" placeholder="company@example.com" required>
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" id="pass1" name="pass1" class="form-control" placeholder="Enter password" required>
        </div>

        <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="pass2" name="pass2" class="form-control" placeholder="Re-enter password" required>
        </div>

        <div class="section-divider"></div>

        <!-- ===== COMPANY DETAILS ===== -->
        <h4>Company Details</h4>

        <div class="form-group">
            <label>Company Name</label>
            <input type="text" name="compname" class="form-control" placeholder="e.g. Acme Technologies Ltd." required>
        </div>

        <div class="form-group">
            <label>Company Type</label>
            <select name="comtype" class="form-control" required>
                <option value="">-- Select Type --</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Government">Government</option>
                <option value="NGO/Non-profit">NGO / Non-profit</option>
                <option value="Startup">Startup</option>
                <option value="Partnership">Partnership</option>
                <option value="MNC">MNC</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div class="form-group">
            <label>Industry</label>
            <select name="indtype" class="form-control" required>
                <option value="">-- Select Industry --</option>
                <option value="Accounting/Consulting/Taxation">Accounting / Consulting / Taxation</option>
                <option value="Advertising/Event Management/PR">Advertising / Event Management / PR</option>
                <option value="Agriculture/Dairy Technology">Agriculture / Dairy Technology</option>
                <option value="Airlines/Hotel/Hospitality/Travel/Tourism/Restaurants">Airlines / Hospitality / Travel / Tourism</option>
                <option value="Animation / Gaming">Animation / Gaming</option>
                <option value="Auto Ancillary/Automobiles/Components">Automotive / Automobiles</option>
                <option value="Banking/Financial Services/Stockbroking/Securities">Banking / Financial Services</option>
                <option value="Biotechnology/Pharmaceutical/Clinical Research">Biotechnology / Pharmaceutical</option>
                <option value="Cement/Construction/Engineering/Metals/Steel/Iron">Construction / Engineering</option>
                <option value="Computer Hardware/Networking">Computer Hardware / Networking</option>
                <option value="Consumer FMCG/Foods/Beverages">Consumer FMCG / Foods / Beverages</option>
                <option value="CRM/ IT Enabled Services/BPO">CRM / IT Services / BPO</option>
                <option value="Education/Training/Teaching">Education / Training / Teaching</option>
                <option value="Employment Firms/Recruitment Services Firms">Employment / Recruitment</option>
                <option value="Entertainment/Media/Publishing/Dotcom">Entertainment / Media / Publishing</option>
                <option value="Government/Defence">Government / Defence</option>
                <option value="Healthcare/Medicine">Healthcare / Medicine</option>
                <option value="Insurance">Insurance</option>
                <option value="KPO/Research/Analytics">KPO / Research / Analytics</option>
                <option value="Law/Legal Firms">Law / Legal</option>
                <option value="NGO/Social Services">NGO / Social Services</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Retailing">Retailing</option>
                <option value="Software Services">Software / IT Services</option>
                <option value="Telecom/ISP">Telecom / ISP</option>
                <option value="Wellness/Fitness/Sports">Wellness / Fitness / Sports</option>
                <option value="Others/Engg. Services/Service Providers">Others</option>
            </select>
        </div>

        <div class="form-group">
            <label>About the Company</label>
            <textarea name="profile" rows="4" class="form-control" placeholder="Brief description of your company..." required></textarea>
        </div>

        <div class="section-divider"></div>

        <!-- ===== CONTACT DETAILS ===== -->
        <h4>Contact & Address</h4>

        <div class="form-group">
            <label>Contact Person (Executive Name)</label>
            <input type="text" name="person" class="form-control" placeholder="e.g. John Smith (HR Manager)" required>
        </div>

        <div class="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" class="form-control" placeholder="e.g. +91 9876543210" required>
        </div>

        <div class="form-group">
            <label>Street Address</label>
            <input type="text" name="addr" class="form-control" placeholder="e.g. 123 Business Park, Sector 5" required>
        </div>

        <div class="form-group">
            <label>Pin / Zip Code</label>
            <input type="text" name="pin_code" class="form-control" placeholder="e.g. 400001" required>
        </div>

        <div class="section-divider"></div>

        <!-- ===== LOCATION ===== -->
        <h4>Location</h4>

        <div class="form-group">
            <label>Country</label>
            <select name="country" class="form-control countries" id="countryId" required>
                <option value="">Select Country</option>
            </select>
        </div>

        <div class="form-group">
            <label>State</label>
            <select name="state" class="form-control states" id="stateId" required>
                <option value="">Select State</option>
            </select>
        </div>

        <div class="form-group">
            <label>City</label>
            <select name="city" class="form-control cities" id="cityId" required>
                <option value="">Select City</option>
            </select>
        </div>

        <div class="section-divider"></div>

        <div class="text-center">
            <button type="submit" class="btn btn-success">Register Company</button>
            <button type="reset"  class="btn btn-danger">Reset</button>
        </div>

    </form>

    <p style="margin-top:20px;">Already have an account? <a href="../login.php" style="color:#00c853;">Login here</a></p>

</div>
</div>

<script src="../js/jquery-1.12.0.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../location/location.js"></script>
</body>
</html>