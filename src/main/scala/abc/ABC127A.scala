package abc.ABC127A

/////////////////////////////////////////////////
// SUBMIT THE CODE BELOW
/////////////////////////////////////////////////

object Main {

  import java.util.Scanner

  def main(args: Array[String]): Unit = {
    val sc = new Scanner(System.in)
    val writer = new java.io.PrintWriter(System.out)
    writer.println(solve(sc))
    writer.flush()
  }

  def solve(sc: Scanner): String = {
    val (a, b) = (sc.nextInt(), sc.nextInt())
    debug(a, b)

    (if (a >= 13) {
      b
    } else if (a >= 6 && a <= 12) {
      b / 2
    } else {
      0
    }).toString
  }

  private def debug(x: Any): Unit = {
    if (System.getenv("LOCAL_DEBUG") != null) println(x)
  }
}
