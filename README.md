# atcoder-tdd-scala

AtCoder の問題を Scala で解くときの TDD テンプレート

---

## ファイル生成

AtCoder のコンテストページからデータを収集して実装ファイルとテストファイルを生成する。  
(クローリングのために Chromium をダウンロードするので初回実行は少し時間がかかる)

```
$ npm run generate -- {contest page url}
```

(例) AtCoder Beginner Contest 128 に関する実装ファイルとテストファイルを生成するとき

```
$ npm run generate -- https://atcoder.jp/contests/abc128
```

---

## 実装ファイル

### main メソッド

ローカルでは実行されない。何も変更しないこと。

### solve メソッド

メソッドのシグニチャは必ず `def solve(sc: Scanner): String` となるようにする。

---

## テストファイル

### testWrapper メソッド

テストの実行部分を抽象化している。何も変更する必要はない。

### テストのウォッチ

テストファイルにもコメントで記述しているが、`export LOCAL_DEBUG=1 && sbt "~testOnly *abc128.ABC128Test -- -z A"` のようなコマンドをターミナルで実行することで、ファイル変更の度に特定のテストケースが実行される。

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

ただし `npm run generate` コマンドでファイル生成した場合は何も変更する必要はない。
