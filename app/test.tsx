const fetchData = async () => {
    const getABID = localStorage.getItem('ab_id');
    const getUsername = localStorage.getItem('username');
    const userDepartment = localStorage.getItem('dept');

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<any>(
        '/api/completed-requisition-liquidation',
        {
          userid: Number(getABID),
          username: getUsername,
        },
      );

      // Filter data by department AND status === 5
      const filteredByDepartmentAndStatus = response.data.data.filter(
        (item: any) =>
          item.department === userDepartment &&
          item.status === 5 // Only include if status is 5
      );

      // Sort by `startDate` (newest first)
      const sorted = [...filteredByDepartmentAndStatus].sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });

      // Initialize totals for Requisition and Liquidation (only status=5)
      let requisitionTotal = 0;
      let liquidationTotal = 0;

      sorted.forEach((item) => {
        const amount = Number(item.totalAmount) || 0;
        if (item.workflowType === "Requisition") {
          requisitionTotal += amount;
        } else if (item.workflowType === "Liquidation") {
          liquidationTotal += amount;
        }
      });

      console.log("Requisition Total (Status=5):", requisitionTotal);
      console.log("Liquidation Total (Status=5):", liquidationTotal);


      setRequisition(requisitionTotal);
      setLiquidation(requisitionTotal); // Optional: Store filtered data in state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };