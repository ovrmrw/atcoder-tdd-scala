package abc

import java.util.Scanner

import io.circe.parser._
import org.scalatest.FunSpec
import org.scalatest.concurrent.TimeLimitedTests
import org.scalatest.time.SpanSugar._

/*
  // AtCoderの問題ページから入力値と出力値のJSONを取得するスクリプト
  (function() {
    var selector = 'span.lang-en div.div-btn-copy + pre';
    var i = document.createElement('input');
    i.value = JSON.stringify(Array.from(document.querySelectorAll(selector)).map(e => e.innerText).reduce((acc, v, i) => { let j = Math.floor(i / 2); if (!acc[j]) acc[j] = []; acc[j].push(v.trim().replace(/\n/g, '\\n')); return acc }, []));
    document.body.append(i); document.querySelector('body > input:last-child').select();
    if (document.execCommand('copy')) { document.querySelector('body > input:last-child').remove(); alert('copied to clipboard.\n' + i.value); }
  })();
*/

// export LOCAL_DEBUG=1 && sbt "~testOnly *abc.ABC127*"

class ABC127Test extends FunSpec with TimeLimitedTests {
  val timeLimit = 2000 millis

  def mockScanner(s: String): Scanner = {
    val testIn = new java.io.ByteArrayInputStream(s.getBytes())
    new Scanner(testIn)
  }

  describe("D") {
    val json =
      """
        |[["3 2\\n5 1 4\\n2 3\\n1 5","14"],["10 3\\n1 8 5 7 100 4 52 33 13 5\\n3 10\\n4 30\\n1 4","338"],["3 2\\n100 100 100\\n3 99\\n3 99","300"],["11 3\\n1 1 1 1 1 1 1 1 1 1 1\\n3 1000000000\\n4 1000000000\\n3 1000000000","10000000001"]]
      """.stripMargin
    val customParams = List(List("3 1\n1 1 1\n3 10", "30"))
    runTest(ABC127D.Main.solve, json, customParams)
  }

  describe("C") {
    val json =
      """
        |[["4 2\\n1 3\\n2 4","2"],["10 3\\n3 6\\n5 7\\n6 9","1"],["100000 1\\n1 100000","100000"]]
      """.stripMargin
    val customParams = List(List("4 2\n1 2\n3 4", "0"))
    runTest(ABC127C.Main.solve, json, customParams)
  }

  describe("B") {
    val json =
      """
        |[["2 10 20","30\\n50\\n90\\n170\\n330\\n650\\n1290\\n2570\\n5130\\n10250"],["4 40 60","200\\n760\\n3000\\n11960\\n47800\\n191160\\n764600\\n3058360\\n12233400\\n48933560"]]
      """.stripMargin
    runTest(ABC127B.Main.solve, json, Nil)
  }

  describe("A") {
    val json =
      """
        |[["30 100","100"],["12 100","50"],["0 100","0"]]
      """.stripMargin
    runTest(ABC127A.Main.solve, json, Nil)
  }

  def runTest(solver: Scanner => String, json: String, customParams: List[List[String]]): Unit = {
    val params = decode[List[List[String]]](json).right.get.map(_.map(_.replace("""\n""", "\n")))
    val test = (d: String, i: String, o: String) =>
      it(d) {
        println(d)
        assert(solver(mockScanner(i)) === o)
      }
    params.zipWithIndex.foreach { case (List(i, o), idx) => test(s"Test params[$idx]", i, o) }
    customParams.zipWithIndex.foreach { case (List(i, o), idx) => test(s"Test customParams[$idx]", i, o) }
  }
}
