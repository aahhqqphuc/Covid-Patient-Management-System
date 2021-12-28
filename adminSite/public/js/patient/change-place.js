$("#change-place-form").submit(function () {
  if (!checkPlace()) {
    return false;
  } else {
    return true;
  }
});
