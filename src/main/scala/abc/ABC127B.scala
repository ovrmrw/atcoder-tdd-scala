package abc.ABC127B

/////////////////////////////////////////////////
// SUBMIT THE CODE BELOW
/////////////////////////////////////////////////

object Main {

  import java.util.Scanner
  import scala.collection.mutable.ArrayBuffer

  def main(args: Array[String]): Unit = {
    val sc = new Scanner(System.in)
    val writer = new java.io.PrintWriter(System.out)
    writer.println(solve(sc))
    writer.flush()
  }

  def solve(sc: Scanner): String = {
    val (r, d, x) = (sc.nextInt(), sc.nextInt(), sc.nextInt())
    debug(r, d, x)

    val weightBuf = ArrayBuffer.empty[Int]
    (1 to 10).foldLeft(x) { (acc, _) =>
      val w = r * acc - d
      weightBuf += w
      w
    }
    weightBuf.mkString("\n")
  }

  private def debug(x: Any): Unit = {
    if (System.getenv("LOCAL_DEBUG") != null) println(x)
  }
}
