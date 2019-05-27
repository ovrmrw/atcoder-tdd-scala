package abc127.ABC127_F

/////////////////////////////////////////////////
// Absolute Minima
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
    "fakeOutput"
  }

  private def debug(x: Any): Unit = {
    if (System.getenv("LOCAL_DEBUG") != null) println(x)
  }
}
