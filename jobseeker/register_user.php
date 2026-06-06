<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Applicants Registration</title>

<link rel="stylesheet" href="../bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="../css/jobseeker.css">

<script>
function checkForm() {
    var p1 = document.getElementById("passnew").value;
    var p2 = document.getElementById("passconf").value;

    if (p1 !== p2) {
        alert("Passwords do not match!");
        return false;
    }
    return true;
}
</script>

</head>
<body>

<nav class="navbar">
  <div class="nav-container">
    <div class="logo">JOB NOVA</div>
    <div class="nav-links">
      <a href="../index.php">Home</a>
      <a href="../login.php">Login</a>
    </div>
  </div>
</nav>

<div class="container">
<div class="container-box">

<h2 class="text-center">Register & Find Jobs</h2>
<hr>

<form id="reguser" method="post" action="process_user.php" onsubmit="return checkForm()" class="form-horizontal">

<h4>Your Login Details</h4>

<div class="form-group">
<label class="control-label col-sm-3">Email:</label>
<div class="col-sm-6">
<input type="email" name="useremail" class="form-control" required>
</div>
</div>

<div class="form-group">
<label class="control-label col-sm-3">Password:</label>
<div class="col-sm-6">
<input type="password" id="passnew" name="pass1" class="form-control" required>
</div>
</div>

<div class="form-group">
<label class="control-label col-sm-3">Confirm Password:</label>
<div class="col-sm-6">
<input type="password" id="passconf" name="pass2" class="form-control" required>
</div>
</div>

<hr>
<h4>Contact Information</h4>

<div class="form-group">
<label class="control-label col-sm-3">Full Name:</label>
<div class="col-sm-6">
<input type="text" name="uname" class="form-control" required>
</div>
</div>

<div class="form-group">
<label class="control-label col-sm-3">Mobile Number:</label>
<div class="col-sm-6">
<input type="text" name="mobno" class="form-control" required>
</div>
</div>

<hr>
<h4>Employment Details</h4>

<div class="form-group">
<label class="control-label col-sm-3">Experience:</label>
<div class="col-sm-6">
<select name="experience" class="form-control" required>
<option value="">Select</option>
<option>1 Year</option>
<option>2 Years</option>
<option>3 Years</option>
<option>4+ Years</option>
</select>
</div>
</div>

<div class="form-group">
<label class="control-label col-sm-3">Skills:</label>
<div class="col-sm-6">
<input type="text" name="skills" class="form-control" required>
</div>
</div>

<hr>
<h4>Education</h4>

<div class="form-group">
<label class="control-label col-sm-3">Graduation:</label>
<div class="col-sm-6">
<select name="ugcourse" class="form-control" required>
<option value="">Select</option>
<option>B.Tech</option>
<option>BCA</option>
<option>B.Com</option>
<option>B.Sc</option>
<option>Other</option>
</select>
</div>
</div>

<div class="form-group">
<label class="control-label col-sm-3">Post Graduation:</label>
<div class="col-sm-6">
<select name="pgcourse" class="form-control" required>
<option value="">Select</option>
<option>MCA</option>
<option>MBA</option>
<option>M.Tech</option>
<option>Other</option>
</select>
</div>
</div>

<hr>

<div class="text-center">
<button type="submit" class="btn btn-success">Register</button>
<button type="reset" class="btn btn-danger">Reset</button>
</div>

</form>

</div>
</div>

<script src="../js/jquery-1.12.0.min.js"></script>
<script src="../js/bootstrap.min.js"></script>

</body>
</html>