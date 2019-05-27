package abc127.ABC127_D

/////////////////////////////////////////////////
// Integer Cards
// (submit the code below)
/////////////////////////////////////////////////

import java.util.Scanner

object Main {
  def main(args: Array[String]): Unit = {
    val sc = new Scanner(System.in)
    val writer = new java.io.PrintWriter(System.out)
    writer.println(solve(sc))
    writer.flush()
  }

  def solve(sc: Scanner): String = {
    val (n, m) = (sc.nextInt(), sc.nextInt())
    val cards = Array.fill(n)(sc.nextLong()).sorted
    val operations = IndexedSeq.fill(m)((sc.nextInt(), sc.nextLong()))
    debug(n, m, cards.toSeq, operations)

    operations.sortBy(_._2).reverse.foldLeft(0) { case (acc, (b, c)) =>
      var i = acc
      while (i < b + acc && i < cards.length && cards(i) < c) {
        cards(i) = c
        i += 1
      }
      i
    }
    cards.sum.toString
  }

  private def debug(x: Any): Unit = {
    if (System.getenv("LOCAL_DEBUG") != null) println(x)
  }
}
