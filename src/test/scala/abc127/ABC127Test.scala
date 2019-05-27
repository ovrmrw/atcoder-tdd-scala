package abc127

import java.util.Scanner

import common.helpers.{mockScanner, runCustomTest}
import org.scalatest.FunSpec
import org.scalatest.concurrent.TimeLimitedTests
import org.scalatest.time.SpanSugar._

/*
  // script for getting inputs and outputs from the task pages of the AtCoder.
  (function() {
    var selector = 'span.lang-en div.div-btn-copy + pre';
    var i = document.createElement('input');
    i.value = JSON.stringify(Array.from(document.querySelectorAll(selector)).map(e => e.innerText).reduce((acc, v, i) => { let j = Math.floor(i / 2); if (!acc[j]) acc[j] = []; acc[j].push(v.trim().replace(/\n/g, '\\n')); return acc }, []));
    document.body.append(i); document.querySelector('body > input:last-child').select();
    if (document.execCommand('copy')) { document.querySelector('body > input:last-child').remove(); alert('copied to clipboard.\n' + i.value); }
  })();
*/

/**
  * Run the command below in your terminal for the continual TDD experience.
  * export LOCAL_DEBUG=1 && sbt "~testOnly *abc127.ABC127Test"
  * Or only the specific test case.
  * export LOCAL_DEBUG=1 && sbt "~testOnly *abc127.ABC127Test -- -z A"
  */
class ABC127Test extends FunSpec with TimeLimitedTests {
  val timeLimit = 2000 millis

  describe("A") {
    val json =
      """
        |[["30 100","100"],["12 100","50"],["0 100","0"]]
      """.stripMargin
    val customParams = List()
    testWrapper("A", ABC127_A.Main.solve, json, customParams)
  }

  describe("B") {
    val json =
      """
        |[["2 10 20","30\\n50\\n90\\n170\\n330\\n650\\n1290\\n2570\\n5130\\n10250"],["4 40 60","200\\n760\\n3000\\n11960\\n47800\\n191160\\n764600\\n3058360\\n12233400\\n48933560"]]
      """.stripMargin
    val customParams = List()
    testWrapper("B", ABC127_B.Main.solve, json, customParams)
  }

  describe("C") {
    val json =
      """
        |[["4 2\\n1 3\\n2 4","2"],["10 3\\n3 6\\n5 7\\n6 9","1"],["100000 1\\n1 100000","100000"]]
      """.stripMargin
    val customParams = List()
    testWrapper("C", ABC127_C.Main.solve, json, customParams)
  }

  describe("D") {
    val json =
      """
        |[["3 2\\n5 1 4\\n2 3\\n1 5","14"],["10 3\\n1 8 5 7 100 4 52 33 13 5\\n3 10\\n4 30\\n1 4","338"],["3 2\\n100 100 100\\n3 99\\n3 99","300"],["11 3\\n1 1 1 1 1 1 1 1 1 1 1\\n3 1000000000\\n4 1000000000\\n3 1000000000","10000000001"]]
      """.stripMargin
    val customParams = List()
    testWrapper("D", ABC127_D.Main.solve, json, customParams)
  }

  ignore("E") {
    val json =
      """
        |[["2 2 2","8"],["4 5 4","87210"],["100 100 5000","817260251"]]
      """.stripMargin
    val customParams = List()
    testWrapper("E", ABC127_E.Main.solve, json, customParams)
  }

  ignore("F") {
    val json =
      """
        |[["4\\n1 4 2\\n2\\n1 1 -8\\n2","4 2\\n1 -3"],["4\\n1 -1000000000 1000000000\\n1 -1000000000 1000000000\\n1 -1000000000 1000000000\\n2","-1000000000 3000000000"]]
      """.stripMargin
    val customParams = List()
    testWrapper("F", ABC127_F.Main.solve, json, customParams)
  }

  def testWrapper(task: String, solver: Scanner => String, json: String, customParams: List[(String, String)]): Unit = {
    def test(description: String, input: String, output: String): Unit =
      it(description) {
        println(s"${this.suiteName}__${task}__$description")
        assert(solver(mockScanner(input)) === output)
      }

    runCustomTest(test, json, customParams)
  }
}
