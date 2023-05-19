(function () {
    var a = [1, 2, 3, 4, 5, 6];
    for (var i = 0; i < a.length / 2; i++) {
        var midd = a[i];
        a[i] = a[a.length - 1 - i];
        a[a.length - 1 - i] = midd;
    }
    console.log(a);
})();
