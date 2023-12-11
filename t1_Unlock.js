function(context, func_args) { // {target:"#s."}

  var digits = Array();
  for (var i = 0; i < 10; i++) {
    digits.push(i);
  }

  var
    COLORS = [
      "purple", "blue", "cyan", "green", "lime", "yellow", "orange", "red"],
    DIGITS = digits,
    LOCKS = ["open", "release", "unlock"],
    // ez_prime lock seems to only request low order primes, hardcoding this
    PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
      61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
      139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193];

  var hackMultLevels = function(target, args, levels) {
    for (var i = 0; i < levels.length; i++) {
      var
        item = levels[i].item,
        itemDesc = levels[i].itemDesc,
        itemList = levels[i].itemList;
      for (var k = 0; k < itemList.length; k++) {
        args[item] = itemList[k];
        ret = target(args);
        if (ret.indexOf(itemDesc) == -1) {
          break;
      }
    }
    return ret, args;
  }

  var hackEz21 = function(target, args) {
    return hackMultLevels(
      target,
      args,
      [
        { item: "ez_21", itemDesc: "command", itemList: LOCKS }
      ]);
  };

  var hackEz35 = function(target, args) {
    return hackMultLevels(
      target,
      args,
      [
        { item: "ez_35", itemDesc: "command", itemList: LOCKS },
        { item: "digit", itemDesc: "digit", itemList: DIGITS }
      ]);
  };

  var hackEz40 = function(target, args) {
    return hackMultLevels(
      target,
      args,
      [
        { item: "ez_40", itemDesc: "command", itemList: LOCKS },
        { item: "ez_prime", itemDesc: "prime", itemList: PRIMES }
      ]);
  };

  var hackC001 = function(target, args) {
    return hackMultLevels(
      target,
      args,
      [
        { item: "c001", itemDesc: "correct", itemList: COLORS },
        { item: "color_digit", itemDesc: "digit", itemList: DIGITS }
      ]);
  }

  var hackC002 = function(target, args) {
    return hackMultLevels(
      target,
      args,
      [
        { item: "c002", itemDesc: "correct", itemList: COLORS },
        { item: "c002_complement", itemDesc: "complement", itemList: COLORS }
      ]);
  }

  var hackC003 = function(target, args) {
    return hackMultLevels(
      target,
      args,
      [
        { item: "c003", itemDesc: "correct", itemList: COLORS },
        { item: "c003_triad_1", itemDesc: "first", itemList: COLORS },
        { item: "c003_triad_2", itemDesc: "second", itemList: COLORS }
      ]);
  }

  var
    args = {},
    i = 0,
    locks = [
      { name: "EZ_21", func: hackEz21 },
      { name: "EZ_35", func: hackEz35 },
      { name: "EZ_40", func: hackEz40 },
      { name: "c001", func: hackC001 },
      { name: "c002", func: hackC002 },
      { name: "c003", func: hackC003 }
    ],
    ret = "",
    target = func_args.target.call,
    unlocked = [];

  ret = target(args);

  while (true) {
    i++;
    var flag = true;

    for (var k = 0; k < locks.length; k++) {
      if (ret.indexOf(locks[k].name) > -1 &&
          unlocked.indexOf(locks[k].name) == -1) {
        ret,  args = locks[k].func(target, args);
        unlocked.push(locks[k].name);
        flag = false;
      }
    }

    if (flag === true) {
      return { ok: true, msg: ret };
    }

    if (i > 10) {
      return { ok: false, msg: ret }
    }
  }
}