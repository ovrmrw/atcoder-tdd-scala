package abc.ABC127C

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
    val (n, m) = (sc.nextInt(), sc.nextInt())
    val gates = IndexedSeq.fill(m)((sc.nextInt(), sc.nextInt()))
    debug(n, m, gates)

    val leftMax = gates.map { case (l, _) => l }.max
    val rightMin = gates.map { case (_, r) => r }.min
    (if (leftMax > rightMin) 0 else rightMin - leftMax + 1).toString
  }

  private def debug(x: Any): Unit = {
    if (System.getenv("LOCAL_DEBUG") != null) println(x)
  }
}
