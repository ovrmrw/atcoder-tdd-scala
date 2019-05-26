package common

import java.util.Scanner

import io.circe.parser.decode

object helpers {
  def mockScanner(s: String): Scanner = {
    val testIn = new java.io.ByteArrayInputStream(s.getBytes())
    new Scanner(testIn)
  }

  def runCustomTest(test: (String, String, String) => Unit, json: String, customParams: List[(String, String)]): Unit = {
    val params: List[(String, String)] =
      decode[List[List[String]]](json).right.get.map(_.map(_.replace("""\n""", "\n"))).map { case List(i, o) => (i, o) }
    params.zipWithIndex.foreach { case ((i, o), idx) => test(s"Test params[$idx]", i, o) }
    customParams.zipWithIndex.foreach { case ((i, o), idx) => test(s"Test customParams[$idx]", i, o) }
  }
}
