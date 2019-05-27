# atcoder-tdd-scala

AtCoder の問題を Scala で解くときの TDD テンプレート

---

## 実装

### main メソッド

ローカルでは実行されない。何も変更しないこと。

### solve メソッド

メソッドのシグニチャは必ず `def solve(sc: Scanner): String` となるようにする。

## テスト

### testWrapper メソッド

テストの実行部分を抽象化している。何も変更する必要はない。

### テストのウォッチ

テストファイルにもコメントで記述しているが、`export LOCAL_DEBUG=1 && sbt "~testOnly *abc.ABC127Test"` のようなコマンドをターミナルで実行することでファイル変更の度にテストが実行される。

- `testOnly` ... 特定ファイルのみテストを実行する。
- `~` ... ファイル変更の度にコマンドを実行する。

### JSON 文字列

テストコードにある

```scala
val json =
  """
    |[["30 100","100"],["12 100","50"],["0 100","0"]]
  """.stripMargin
```

の JSON 文字列部分は、テストファイルの上部にある JavaScript を実行して取得した値をペーストする。

---

## ファイル生成

```
$ npm run generate -- {package} {contest}
```

(例) AtCoder Beginner Contest 128 に関する実装ファイルとテストファイルを生成するとき

```
$ npm run generate -- abc abc128
```

`package` を階層構造にすることも可能

```
$ npm run generate -- hoge.foo.bar abc128
```
